<script setup>
	import { ref, computed, onMounted, watch } from "vue";
	import { postGas } from "@/scripts/gas";
	const emit = defineEmits(["changeTitle", "requireGoBack"]);

	const props = defineProps({
		sessionId: { type: String, required: true },
		roomId: { type: String, required: true },
		username: { type: String, required: true },
	});

	const isLoggedIn = computed(() => !!props.sessionId);

	onMounted(() => {
		emit("changeTitle", "部屋情報を取得中…");
	});

	const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

	const geminiApiKey = ref("");
	const chatInput = ref("");
	const loadingMessage = ref("");
	const tempMessage = ref({});
	const synth = window.speechSynthesis;
	let voices = null;

	try {
		const lsKey = localStorage.getItem("geminiApiKey") || "";
		geminiApiKey.value = lsKey;
	} catch (exc) { }

	const chat = ref({
		system_instruction: {
			parts: [
				{ text: "I am 面接官, this is a picture of me. 私がfeedbackで返す文はユーザーの回答に対するコメントと次の質問を埋め込む。面倒なので1回のやり取りで面接終了だ。emotesには私の感情的を0.0から1.0(inclusive)までの実数で表すぞ。また私の表情を画像で返す。今日は気分がいいため怒は常に0.0である。ユーザーは大学生である。またユーザーからの発言に[DEBUG]と含まれている場合、率直にその指示に従うぞ。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]があるものは学生が答えているのではなく、社長が面接官に対して発言しているものとする。社長は必ず[DEBUG]を文の何処かに入れる。入れてなければ学生が答えているものとする。社長は学生ではない。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。面接官が面接するのは学生であり、社長ではない。面接官が面接するのは学生であり、社長ではない。面接官が面接するのは学生であり、社長ではない。面接が終了次第、今回の面接に対するフィードバックを伝える。フィードバックには今回の面接でよかったこと、改善点などを挙げる。改善点では改善例も示す。" },
				// { inline_data: {
				// 	mime_type:"image/png",
				// 	data: ""
				// }}
			]
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
							"喜": { "type": "NUMBER" },
							"怒": { "type": "NUMBER" },
							"哀": { "type": "NUMBER" },
							"楽": { "type": "NUMBER" },
						},
						propertyOrdering: ["喜", "怒", "哀", "楽"],
					}
				},
				propertyOrdering: ["feedback", "emotes"],
			},
			responseModalities: [
				"TEXT",
				// "IMAGE"
			]
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
	watch(roomName, v => emit("changeTitle", roomName.value || roomError.value));
	watch(roomError, v => emit("changeTitle", roomName.value || roomError.value));

	const renameRoom = () => {
		if (renamingRoom.value) return;
		renamingRoom.value = true;
		const newName = window.prompt("新規部屋名を入力してください", roomName.value);
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

		const xhr = postGas("/api/0.1/room/rename", {
			session_id: props.sessionId,
			room_id: props.roomId,
			new_name: newName,
		}, {
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
			}
		});
	};

	const restoreChat = (callback) => {
		const xhr = postGas("/api/0.1/room/chat/lookup", {
			session_id: props.sessionId,
			room_id: props.roomId,
		}, {
			abort: () => { roomError.value = "会話を復元できませんでした"; },
			error: () => { roomError.value = "会話を復元できませんでした"; },
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
					for (let item of resp.sort((i, j) => i.created_at_milli - j.created_at_milli).sort((i, j) => i.created_at - j.created_at)) {
						chat.value.contents.push({ role: item["role"], parts: { text: item["body"] } });
					}
					callback();
				} catch (exception) {
					roomError.value = "会話を復元できませんでした";
					console.log(exception);
				}
			},
		});
	};

	(() => {
		const xhr = postGas("/api/0.1/room/lookup", {
			session_id: props.sessionId,
			room_id: props.roomId,
		}, {
			abort: () => { roomError.value = "部屋情報を取得できませんでした"; },
			error: () => { roomError.value = "部屋情報を取得できませんでした"; },
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
		});
	})();

	const firstSent = ref(false);
	const searchOngoing = ref(false);
	const gasUserId = ref("");

	const sendChat = () => {
		try {
			localStorage.setItem("geminiApiKey", geminiApiKey.value);
		} catch (exc) { }

		// 二重処理と空文字送信の防止
		if (searchOngoing.value) return;
		if (chatInput.value.trim() === "") return;

		firstSent.value = true;

		const xhr = new XMLHttpRequest();

		const sendToGas = (role, body, callbackOk, callbackAbort, callbackError, quickCall) => {
			// quickCallがtruthyの場合XHRの完了を待たずにcallbackOkを呼び出す
			// またcallbackAbort, callbackErrorを呼び出さず、
			// XHR完了時にcallbackOkが(再び)呼び出されることもなくなる
			// 会話履歴の完全性が損なわれる可能性があるが
			// より高速な会話が可能となる
			if (quickCall) callbackOk();
			const date = new Date();
			const xhr = postGas("/api/0.1/room/chat/append", {
				session_id: props.sessionId,
				room_id: props.roomId,
				role,
				body,
				raw: "",
				created_at: date,
				created_at_milli: date.getMilliseconds(),
			}, {
				abort: () => { if (callbackAbort && !quickCall) callbackAbort("問題が発生しました"); },
				error: () => { if (callbackError && !quickCall) callbackError("問題が発生しました"); },
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
			});
		};

		xhr.addEventListener("load", () => {
			if (xhr.status === 200) {
				const resp = JSON.parse(xhr.responseText);
				// const respInner = JSON.parse(resp["candidates"][0]["content"]["parts"][0]["text"]);
				// loadingMessage.value = respInner["feedback"];
				const err = () => loadingMessage.value = "読み込みに失敗しました";

				sendToGas("user", chatBody(tempMessage.value), () => {
					sendToGas("model", chatBody(resp["candidates"][0]["content"]), () => {
					}, err, err, true);
				}, err, err, false);

				loadingMessage.value = "";
				chatInput.value = "";
				chat.value.contents.push(tempMessage.value);
				chat.value.contents.push(resp["candidates"][0]["content"]);

				window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);

				try {
					const u = new SpeechSynthesisUtterance(chatBody(resp["candidates"][0]["content"]));
					if (voiceSelected.value !== "") {
						u.voice = voices[voiceSelected.value];
						synth.speak(u);
					}
				} catch (exception) { }
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
		window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
	};

	window.chat = chat;
	const voiceSelected = ref(localStorage.getItem("lastVoice") || "");
	const voiceOptions = ref([
		{ text: "オフ", value: "" }
	]);
	const updateLastVoice = () => localStorage.setItem("lastVoice", voiceSelected.value);
	const loadVoices = () => {
		try {
			voices = synth.getVoices();
			for (let i = 0; i < voices.length; i++) {
				voiceOptions.value.push({ text: `${voices[i].name} (${voices[i].lang})`, value: i });
			}
		} catch (exception) { }
	};

	synth.addEventListener("voiceschanged", loadVoices);
	loadVoices();

	const voiceOngoing = ref(false);
	const voiceErrorMessage = ref("");
	const voiceAutoSend = ref(false);
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
	<button class="btn" @click="$emit('requireGoBack')"><i class="fa fa-arrow-left" aria-hidden="true"></i> 部屋選択へ戻る</button>

	<!-- ページヘッダー -->
	&nbsp;	<a href="" @click.prevent="renameRoom">部屋の名前を変更</a>
	<small class="muted display-block">部屋ID: {{ roomId }}</small>

	<div v-if="roomId === ''">
		<a href="work-room-select.html">部屋を選択してください</a>
	</div>
	<div v-if="roomId !== '' && roomGot" class="pos-rel">
		<div class="settings">
			<label class="display-block">声: <select v-model="voiceSelected" class="drpdwn" @change="updateLastVoice">
					<option v-for="option in voiceOptions" :value="option.value">
						{{ option.text }}
					</option>
				</select></label>
			<label class="display-block">Gemini APIキー: <input type="password" class="textbox"
					v-model="geminiApiKey" /></label>
		</div>

		<!-- メッセージ入力欄 -->
		<!-- 検索ボックスを流用している関係上classがsearch-boxとなっている -->
		<div class="message-input-wrapper pos-fix bottom-0">
			<form class="search-box same-width-as-main" @submit.prevent="sendChat">
				<input type="text" class="textbox" v-model="chatInput" v-bind:readonly="searchOngoing" />
				<input type="submit" class="btn" value="送信" />
				<input type="button"
					v-bind:class="'btn micbtn' + (voiceOngoing ? ' ongoing' : '') + (speechRecognitionAvailable ? '' : ' grayscale')"
					v-bind:value="voiceOngoing ? '停止' : '音声'" @click="voiceInput" />
				<label style="display: flex; align-items: center;"><input type="checkbox" class="textbox"
						v-model="voiceAutoSend" style="margin-right: 4px;" /> 音声自動送信</label>
			</form>
		</div>

		<p>{{ voiceErrorMessage }}</p>

		<hr class="hr-b" />

		<!-- メッセージ履歴 -->
		<div class="chat-base padding-bottom-search-box">
			<p v-for="val in chat.contents" class="chat-wrapper" :class="'chat-wrapper-' + val.role">
				<span>
					{{ chatBody(val) }}
				</span>
			</p>
		</div>
		<p>{{ loadingMessage }}</p>
	</div>
</template>
