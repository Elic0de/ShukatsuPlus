(function() {
	"use strict";

	const GAS_API_ENDPOINT = "https://script.google.com/macros/s/AKfycbwfKSr7DkneqbXE4T2fxbPJ9ZnZtt-zzSGIdFeyjILUuxqslJNWTQMJFmt5qimKxVsl7Q/exec";
	// const GAS_API_ENDPOINT = "https://lp.example.com/devn.php";

	const { createApp, ref } = Vue;

	const postGas = (path, body, handlers) => {
		const xhr = new XMLHttpRequest();
		const url = new URL(GAS_API_ENDPOINT);
		url.searchParams.set("path", path);

		if (handlers) {
			xhr.onabort = handlers.abort;
			xhr.onerror = handlers.error;
			xhr.onload = handlers.load;
			xhr.onloadend = handlers.loadend;
			xhr.onloadstart = handlers.loadstart;
			xhr.onprogress = handlers.progress;
			xhr.onreadystatechange = handlers.readystatechange;
			xhr.ontimeout = handlers.timeout;
		}

		xhr.open("POST", url.toString());
		// application/json にすると失敗する
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(JSON.stringify(body));

		return xhr;
	};

	createApp({
		setup() {
			const sessionId = localStorage.getItem("SessionId") || "";
			const loggedIn = ref(sessionId !== "");
			const rooms = ref([]);
			const error = ref("");
			const updating = ref(false);

			const updateRoomList = () => {
				if (!loggedIn.value) {
					rooms.value = [];
					error.value = "ログインしてください";
					return;
				}

				if (updating.value) return;
				updating.value = true;
				error.value = "部屋一覧を取得中…";

				const xhr = postGas("/api/0.1/room/query_user", {
					session_id: sessionId,
				}, {
					loadend: () => { updating.value = false; },
					abort: () => { error.value = "問題が発生しました"; },
					error: () => { error.value = "問題が発生しました"; },
					load: () => {
						try {
							// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
							// レスポンスボディーを見る
							const resp = JSON.parse(xhr.responseText);
							if ("error" in resp) {
								error.value = resp.error;
								return;
							}
							error.value = "";
							rooms.value = resp;
						} catch (exception) {
							error.value = "問題が発生しました: " + exception;
						}
					},
				});
			};

			const mkroom = ref({
				error: "",
				trying: false,
				id: "",
				name: "新規部屋",
				exec: () => {
					if (mkroom.value.trying) return;
					mkroom.value.trying = true;
					mkroom.value.error = "作成中…";

					const xhr = postGas("/api/0.1/room/create", {
						session_id: sessionId,
						name: mkroom.value.name || "新規部屋",
					}, {
						loadend: () => { mkroom.value.trying = false; },
						abort: () => { mkroom.value.error = "問題が発生しました"; },
						error: () => { mkroom.value.error = "問題が発生しました"; },
						load: () => {
							try {
								// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
								// レスポンスボディーを見る
								const resp = JSON.parse(xhr.responseText);
								if ("error" in resp) {
									mkroom.value.error = resp.error;
									return;
								}
								mkroom.value.error = "部屋を作成しました!";
								updateRoomList();
							} catch (exception) {
								mkroom.value.error = "問題が発生しました: " + exception;
							}
						},
					});
				},
			});

			updateRoomList();

			return window.d = {
				loggedIn, rooms, updateRoomList, error, updating, mkroom,
			};
		},
	}).mount("#app");
})();
