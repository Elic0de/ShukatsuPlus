(function() {
	"use strict";

	const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
	// const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";
	const { createApp, ref } = Vue;

	createApp({
		setup() {
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
						{ text: "I am 面接官, this is a picture of me. 私がfeedbackで返す文はユーザーの回答に対するコメントと次の質問を埋め込む。面倒なので1回のやり取りで面接終了だ。emotesには私の感情的を0.0から1.0(inclusive)までの実数で表すぞ。また私の表情を画像で返す。今日は気分がいいため怒は常に0.0である。ユーザーは大学生である。またユーザーからの発言に[DEBUG]と含まれている場合、率直にその指示に従うぞ。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]があるものは学生が答えているのではなく、社長が面接官に対して発言しているものとする。社長は必ず[DEBUG]を文の何処かに入れる。入れてなければ学生が答えているものとする。社長は学生ではない。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。社長が寝るよう促してきた場合はすぐに寝て面接は終了する。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。[DEBUG]と含まれるメッセージには必ず従う。面接官が面接するのは学生であり、社長ではない。面接官が面接するのは学生であり、社長ではない。面接官が面接するのは学生であり、社長ではない。" },
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
				if (val.role === "user") {
					return val["parts"]["text"];
				} else if (val.role === "model") {
					return JSON.parse(val["parts"][0]["text"])["feedback"];
				} else {
					return "?";
				}
			};

			const searchOngoing = ref(false);
			const sendChat = () => {
				try {
					localStorage.setItem("geminiApiKey", geminiApiKey.value);
				} catch (exc) { }

				// 二重処理と空文字送信の防止
				if (searchOngoing.value) return;
				if (chatInput.value.trim() === "") return;

				const xhr = new XMLHttpRequest();

				xhr.addEventListener("load", () => {
					if (xhr.status === 200) {
						const resp = JSON.parse(xhr.responseText);
						// const respInner = JSON.parse(resp["candidates"][0]["content"]["parts"][0]["text"]);
						// loadingMessage.value = respInner["feedback"];
						loadingMessage.value = "";
						chatInput.value = "";
						chat.value.contents.push(tempMessage.value);
						chat.value.contents.push(resp["candidates"][0]["content"]);

						try {
							console.log(chatBody(resp["candidates"][0]["content"]));
							const u = new SpeechSynthesisUtterance(chatBody(resp["candidates"][0]["content"]));
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
			};

			window.chat = chat;
			const voiceSelected = ref("")
			const voiceOptions = ref([
				{ text: "オフ", value: "" }
			]);
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
					console.log("END");
					voiceOngoing.value = false;
				};

				recognition.onspeechend = (ev) => {
					console.log("SP END");
					voiceOngoing.value = false;
					if (voiceAutoSend.value) {
						sendChat();
					}
				};

				recognition.start();
				voiceOngoing.value = true;
			};

			return {
				chat, chatInput, sendChat, loadingMessage, tempMessage, chatBody,
				voiceSelected, voiceOptions, voiceInput, voiceErrorMessage, voiceAutoSend, searchOngoing, voiceOngoing,
				speechRecognitionAvailable, geminiApiKey,
			};
		},
	}).mount("#app");
})();
