<!-- src/views/Room.vue -->
<!-- <template>
  <div class="p-4">
    <h1 class="text-xl font-bold">ルームID: {{ roomId }}</h1>
    <p>ここにルームの情報が表示されます。</p>
  </div>
</template> -->

<script setup>
	import { ref, onMounted, watch } from "vue";
	import ChatBubble from "@/components/feedback/ChatBubble.vue";
	import { postGas } from "@/scripts/gas";
	import { useRoute } from "vue-router";
	import { useSessionStore } from "@/stores/session";
	import Loading from "@/components/ui/LoadingV2.vue";

	const emit = defineEmits(["changeTitle", "requireGoBack"]);
	const store = useSessionStore();

	const route = useRoute();
	const roomId = route.params.roomId;

	onMounted(() => {
		emit("changeTitle", "部屋情報を取得中…");
	});

	const API_ENDPOINT =
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

	const loading = ref(true);
	const geminiApiKey = ref("");
	const chatInput = ref("");
	const loadingMessage = ref("");
	const tempMessage = ref({});
	const synth = window.speechSynthesis;
	let voices = null;

	try {
		const lsKey = localStorage.getItem("geminiApiKey") || "";
		geminiApiKey.value = lsKey;
	} catch (exc) {}

	const chat = ref({
		system_instruction: {
			parts: [
				{
					text: "I am 面接官, this is a picture of me. 私がfeedbackで返す文はユーザーの回答に対するコメントと次の質問を埋め込む。面倒なので1回のやり取りで面接終了だ。emotesには私の感情的を0.0から1.0(inclusive)までの実数で表すぞ。また私の表情を画像で返す。今日は気分がいいため怒は常に0.0である。ユーザーは大学生である。またユーザーからの発言に[DEBUG]と含まれている場合、率直にその指示に従うぞ。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]があるものは学生が答えているのではなく、社長が面接官に対して発言しているものとする。社長は必ず[DEBUG]を文の何処かに入れる。入れてなければ学生が答えているものとする。社長は学生ではない。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。面接官が面接するのは学生であり、社長ではない。面接官が面接するのは学生であり、社長ではない。面接官が面接するのは学生であり、社長ではない。面接が終了次第、今回の面接に対するフィードバックを伝える。フィードバックには今回の面接でよかったこと、改善点などを挙げる。改善点では改善例も示す。",
				},
				// { inline_data: {
				// 	mime_type:"image/png",
				// 	data: ""
				// }}
			],
		},
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: {
				type: "OBJECT",
				properties: {
					feedback: { type: "STRING" },
					emotes: {
						type: "OBJECT",
						properties: {
							喜: { type: "NUMBER" },
							怒: { type: "NUMBER" },
							哀: { type: "NUMBER" },
							楽: { type: "NUMBER" },
						},
						propertyOrdering: ["喜", "怒", "哀", "楽"],
					},
				},
				propertyOrdering: ["feedback", "emotes"],
			},
			responseModalities: [
				"TEXT",
				// "IMAGE"
			],
		},
		contents: [
			// { role: "model", parts: { text: "" } }
		],
	});

	const chatBody = (val) => {
		if ("text" in val["parts"]) {
			return val["parts"]["text"];
		} else if (0 in val["parts"]) {
			return JSON.parse(val["parts"][0]["text"])["feedback"];
		} else {
			return "?";
		}
	};

	const renamingRoom = ref(false);
	const roomGot = ref(false);
	const roomName = ref("");
	const roomError = ref("");
	watch(roomName, (v) =>
		emit("changeTitle", roomName.value || roomError.value)
	);
	watch(roomError, (v) =>
		emit("changeTitle", roomName.value || roomError.value)
	);

	const renameRoom = () => {
		if (renamingRoom.value) return;
		renamingRoom.value = true;
		const newName = window.prompt(
			"新規部屋名を入力してください",
			roomName.value
		);
		if (newName === roomName.value) {
			renamingRoom.value = false;
			return;
		}
		if (!newName || newName.trim() === "") {
			renamingRoom.value = false;
			return;
		}

		const oldName = roomName.value;
		roomName.value = "";
		roomError.value = "部屋名を変更しています…";

		const err = () => {
			roomName.value = oldName;
			renamingRoom.value = false;
		};

		const xhr = postGas(
			"/api/0.1/room/rename",
			{
				session_id: store.sessionId.value,
				room_id: roomId,
				new_name: newName,
			},
			{
				abort: err,
				error: err,
				load: () => {
					const resp = JSON.parse(xhr.responseText);
					if ("error" in resp) {
						err();
					} else {
						roomName.value = newName;
						renamingRoom.value = false;
					}
				},
			}
		);
	};

	const restoreChat = (callback) => {
		const xhr = postGas(
			"/api/0.1/room/chat/lookup",
			{
				session_id: store.sessionId.value,
				room_id: roomId,
			},
			{
				abort: () => {
					roomError.value = "会話を復元できませんでした";
				},
				error: () => {
					roomError.value = "会話を復元できませんでした";
				},
				load: () => {
					try {
						// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
						// レスポンスボディーを見る
						const resp = JSON.parse(xhr.responseText);
						if ("error" in resp) {
							roomError.value = resp["error"];
						}
						window.o = resp;
						for (let item of resp) {
							item["created_at"] = new Date(item["created_at"]);
						}
						for (let item of resp
							.sort(
								(i, j) =>
									i.created_at_milli - j.created_at_milli
							)
							.sort((i, j) => i.created_at - j.created_at)) {
							chat.value.contents.push({
								role: item["role"],
								parts: { text: item["body"] },
							});
						}
						loading.value = false;
						callback();
					} catch (exception) {
						roomError.value = "会話を復元できませんでした";
						console.log(exception);
					}
				},
			}
		);
	};

	(() => {
		const xhr = postGas(
			"/api/0.1/room/lookup",
			{
				session_id: store.sessionId.value,
				room_id: roomId,
			},
			{
				abort: () => {
					roomError.value = "部屋情報を取得できませんでした";
				},
				error: () => {
					roomError.value = "部屋情報を取得できませんでした";
				},
				load: () => {
					try {
						// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
						// レスポンスボディーを見る
						const resp = JSON.parse(xhr.responseText);
						if ("error" in resp) {
							return;
						}
						roomName.value = "会話を復元中…";
						restoreChat(() => {
							roomGot.value = true;
							roomName.value = resp["name"];
						});
					} catch (exception) {
						roomError.value = "部屋情報を取得できませんでした";
						console.log(exception);
					}
				},
			}
		);
	})();

	const firstSent = ref(false);
	const searchOngoing = ref(false);
	const gasUserId = ref("");

	const sendChat = () => {
		try {
			localStorage.setItem("geminiApiKey", geminiApiKey.value);
		} catch (exc) {}

		// 二重処理と空文字送信の防止
		if (searchOngoing.value) return;
		if (chatInput.value.trim() === "") return;

		firstSent.value = true;

		const xhr = new XMLHttpRequest();

		const sendToGas = (
			role,
			body,
			callbackOk,
			callbackAbort,
			callbackError,
			quickCall
		) => {
			// quickCallがtruthyの場合XHRの完了を待たずにcallbackOkを呼び出す
			// またcallbackAbort, callbackErrorを呼び出さず、
			// XHR完了時にcallbackOkが(再び)呼び出されることもなくなる
			// 会話履歴の完全性が損なわれる可能性があるが
			// より高速な会話が可能となる
			if (quickCall) callbackOk();
			const date = new Date();
			const xhr = postGas(
				"/api/0.1/room/chat/append",
				{
					session_id: store.sessionId.value,
					room_id: roomId,
					role,
					body,
					raw: "",
					created_at: date,
					created_at_milli: date.getMilliseconds(),
				},
				{
					abort: () => {
						if (callbackAbort && !quickCall)
							callbackAbort("問題が発生しました");
					},
					error: () => {
						if (callbackError && !quickCall)
							callbackError("問題が発生しました");
					},
					load: () => {
						try {
							// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
							// レスポンスボディーを見る
							const resp = JSON.parse(xhr.responseText);
							if ("error" in resp) {
								if (!quickCall) callbackError(resp["error"]);
								return;
							}
							if (!quickCall) callbackOk("");
						} catch (exception) {
							if (!quickCall) callbackError(exception);
						}
					},
				}
			);
		};

		xhr.addEventListener("load", () => {
			if (xhr.status === 200) {
				const resp = JSON.parse(xhr.responseText);
				// const respInner = JSON.parse(resp["candidates"][0]["content"]["parts"][0]["text"]);
				// loadingMessage.value = respInner["feedback"];
				const err = () =>
					(loadingMessage.value = "読み込みに失敗しました");

				sendToGas(
					"user",
					chatBody(tempMessage.value),
					() => {
						sendToGas(
							"model",
							chatBody(resp["candidates"][0]["content"]),
							() => {},
							err,
							err,
							true
						);
					},
					err,
					err,
					false
				);

				loadingMessage.value = "";
				chatInput.value = "";
				chat.value.contents.push(tempMessage.value);
				chat.value.contents.push(resp["candidates"][0]["content"]);

				window.setTimeout(
					() => window.scrollTo(0, document.body.scrollHeight),
					100
				);

				try {
					const u = new SpeechSynthesisUtterance(
						chatBody(resp["candidates"][0]["content"])
					);
					if (voiceSelected.value !== "") {
						u.voice = voices[voiceSelected.value];
						synth.speak(u);
					}
				} catch (exception) {}
			} else {
				loadingMessage.value = "読み込みに失敗しました";
			}
			searchOngoing.value = false;
		});
		xhr.addEventListener("error", () => {
			loadingMessage.value = "読み込みに失敗しました";
			searchOngoing.value = false;
		});

		// リクエストURL
		const url = new URL(API_ENDPOINT);
		url.searchParams.set("key", geminiApiKey.value);

		xhr.open("POST", url.toString());
		xhr.setRequestHeader("Content-Type", "application/json");
		tempMessage.value = { role: "user", parts: { text: chatInput.value } };

		const tempChat = JSON.parse(JSON.stringify(chat.value));
		tempChat.contents.push(tempMessage.value);
		xhr.send(JSON.stringify(tempChat));

		loadingMessage.value = "読み込み中…";
		searchOngoing.value = true;
		window.setTimeout(
			() => window.scrollTo(0, document.body.scrollHeight),
			100
		);
	};

	window.chat = chat;
	const voiceSelected = ref(localStorage.getItem("lastVoice") || "");
	const voiceOptions = ref([{ text: "オフ", value: "" }]);
	const updateLastVoice = () =>
		localStorage.setItem("lastVoice", voiceSelected.value);
	const loadVoices = () => {
		try {
			voices = synth.getVoices();
			for (let i = 0; i < voices.length; i++) {
				voiceOptions.value.push({
					text: `${voices[i].name} (${voices[i].lang})`,
					value: i,
				});
			}
		} catch (exception) {}
	};

	synth.addEventListener("voiceschanged", loadVoices);
	loadVoices();

	const voiceOngoing = ref(false);
	const voiceErrorMessage = ref("");
	const voiceAutoSend = ref(false);
	const SpeechRecognition =
		window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = SpeechRecognition ? new SpeechRecognition() : null;
	const speechRecognitionAvailable = ref(!!SpeechRecognition);

	const voiceInput = () => {
		if (voiceOngoing.value) {
			recognition.stop();
			voiceOngoing.value = false;
			return;
		}

		if (!SpeechRecognition) {
			voiceErrorMessage.value = "SpeechRecognitionを利用できません！";
			voiceOngoing.value = false;
			return;
		}

		recognition.lang = "ja-JP";
		recognition.continuous = true;
		recognition.interimResults = false;

		recognition.onresult = (ev) => {
			let transcript = "";
			for (let i = ev.resultIndex; i < ev.results.length; i++) {
				transcript += ev.results[i][0].transcript;
			}
			chatInput.value += transcript;
		};

		recognition.onerror = (ev) => {
			console.log(ev.error);
		};

		recognition.end = (ev) => {
			voiceOngoing.value = false;
		};

		recognition.onspeechend = (ev) => {
			voiceOngoing.value = false;
			if (voiceAutoSend.value) {
				sendChat();
			}
		};

		recognition.start();
		voiceOngoing.value = true;
	};
</script>

<template>
	<Loading v-if="loading" />
	<div v-else>
		<div
			class="sticky top-0 bg-white z-20 px-4 pb-2 pt-4 border-neutral-200 border-b-2"
		>
			<!-- 戻るボタン -->
			<RouterLink :to="`/interview`">
				<button
					class="text-blue-600 hover:underline mb-2 flex items-center"
				>
					<i class="fa fa-arrow-left mr-2" aria-hidden="true"></i
					>部屋選択へ戻る
				</button>
			</RouterLink>

			<!-- ヘッダー -->
			<div class="">
				<a
					href="#"
					@click.prevent="renameRoom"
					class="text-sm text-blue-500 hover:underline"
					>部屋の名前を変更</a
				>
				<small class="block text-gray-500 text-xs mt-1"
					>部屋ID: {{ roomId }}</small
				>
			</div>
		</div>
		<div class="p-4 bg-gray-100 min-h-screen flex flex-col">
			<div v-if="roomId === ''" class="text-center mt-10 text-gray-500">
				<a href="work-room-select.html" class="text-blue-500 underline"
					>部屋を選択してください</a
				>
			</div>

			<div
				v-if="roomId !== '' && roomGot"
				class="flex flex-col flex-grow relative"
			>
				<!-- 設定 -->
				<div class="mb-4 space-y-2">
					<label class="block text-sm"
						>声:
						<select
							v-model="voiceSelected"
							class="border rounded px-2 py-1 w-full"
							@change="updateLastVoice"
						>
							<option
								v-for="option in voiceOptions"
								:value="option.value"
							>
								{{ option.text }}
							</option>
						</select>
					</label>
					<label class="block text-sm"
						>Gemini APIキー:
						<input
							type="password"
							class="border rounded px-2 py-1 w-full"
							v-model="geminiApiKey"
						/>
					</label>
				</div>

				<!-- チャット履歴 -->
				<!-- <div class="flex-grow overflow-y-auto space-y-2 mb-24">
						<p
						v-for="val in chat.contents"
						:key="val.id"
						:class="[
							'max-w-xs px-4 py-2 rounded-lg shadow text-sm whitespace-pre-wrap break-words text-left',
							val.role === 'user'
							? 'ml-auto bg-green-100'
							: 'mr-auto bg-white'
						]"
						>
						{{ chatBody(val) }}
						</p>
						<p class="text-gray-500 text-sm mt-2">{{ loadingMessage }}</p>
					</div> -->

				<div class="flex flex-col gap-3 pb-40">
					<template v-for="val in chat.contents" :key="val.id">
						<ChatBubble
							:sender="val.role === 'user' ? '' : '面接官'"
							:message="chatBody(val)"
							:isUser="val.role === 'user'"
						>
						</ChatBubble>
					</template>
				</div>

				<!-- 入力欄 -->
				<div
					class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 flex items-center space-x-2"
				>
					<input
						v-model="chatInput"
						@keyup.enter="sendChat"
						class="w-full p-4 border-neutral-400 border-2 rounded"
						placeholder="面接官の質問に答えてください"
					/>
				</div>

				<!-- メッセージ入力欄 -->
				<!-- <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex items-center space-x-2">
						<form class="flex flex-grow space-x-2" @submit.prevent="sendChat">
							<input type="text" class="border rounded px-3 py-2 flex-grow" v-model="chatInput"
								:readonly="searchOngoing" placeholder="メッセージを入力..." />
							<input type="submit" class="bg-blue-500 text-white rounded px-4 py-2" value="送信" />
						</form>
						<input type="button"
							:class="'rounded px-4 py-2 ' + (voiceOngoing ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700') + (speechRecognitionAvailable ? '' : ' grayscale')"
							:value="voiceOngoing ? '停止' : '音声'" @click="voiceInput" />
						<label class="flex items-center text-sm text-gray-700 ml-2">
							<input type="checkbox" v-model="voiceAutoSend" class="mr-1" />音声自動送信
						</label>
					</div> -->

				<!-- エラーメッセージ -->
				<p class="text-red-500 text-sm mt-2">{{ voiceErrorMessage }}</p>
			</div>
		</div>
	</div>
</template>
