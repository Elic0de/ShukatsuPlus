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

			const username = ref("");
			if (loggedIn.value) {
				const xhr = postGas("/api/0.1/session/lookup", {
					session_id: sessionId,
				}, {
					load: () => {
						try {
							const resp = JSON.parse(xhr.responseText);
							if ("error" in resp) {
								return;
							}
							username.value = resp["user_id"];
						} catch (exception) {
						}
					},
				});
			}

			const dologin = ref({
				error: "",
				userId: "",
				password: "",
				trying: false,
				exec: () => {
					if (dologin.value.trying) return;
					dologin.value.trying = true;
					dologin.value.error = "ログイン中…";

					const xhr = postGas("/api/0.1/session/create", {
						user_id: dologin.value.userId,
						password: dologin.value.password,
					}, {
						abort: () => { dologin.value.error = "問題が発生しました"; dologin.value.trying = false; },
						error: () => { dologin.value.error = "問題が発生しました"; dologin.value.trying = false; },
						load: () => {
							try {
								// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
								// レスポンスボディーを見る
								const resp = JSON.parse(xhr.responseText);
								if ("error" in resp) {
									dologin.value.error = resp.error;
									return;
								}
								const intv = window.setInterval(() => {
									const err = () => {
										clearInterval(intv);
										dologin.value.error = "問題が発生しました";
										dologin.value.trying = false;
									};
									const xhr = postGas("/api/0.1/session/check", {
										try_id: resp["try_id"],
									}, {
										abort: err,
										error: err,
										load: () => {
											try {
												const resp2 = JSON.parse(xhr.responseText);
												if (resp2["status"] === "accepted") {
													dologin.value.error = "ログインしました!";
													localStorage.setItem("SessionId", resp2["session_id"]);
													window.setTimeout(() => window.location = "./work-room-select.html", 1000);
												} else if (resp2["status"] === "denied") {
													clearInterval(intv);
													dologin.value.error = "ユーザー名またはパスワードが間違っています";
													dologin.value.trying = false;
												}
											} catch (ex) {
												err();
											}
										},
									});
								}, 1000);
							} catch (exception) {
								dologin.value.error = "問題が発生しました: " + exception;
							}
						},
					});
				},
			});

			const mkaccount = ref({
				error: "",
				trying: false,
				userId: "",
				password: "",
				passwordConfirm: "",
				exec: () => {
					if (mkaccount.value.password !== mkaccount.value.passwordConfirm) {
						mkaccount.value.error = "確認用パスワードが一致しません";
						return;
					}
					if (mkaccount.value.trying) return;
					mkaccount.value.trying = true;

					const xhr = postGas("/api/0.1/account/create", {
						user_id: mkaccount.value.userId,
						password: mkaccount.value.password,
					}, {
						loadend: () => { mkaccount.value.trying = false; },
						abort: () => { mkaccount.value.error = "問題が発生しました"; },
						error: () => { mkaccount.value.error = "問題が発生しました"; },
						load: () => {
							try {
								// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
								// レスポンスボディーを見る
								const resp = JSON.parse(xhr.responseText);
								if ("error" in resp) {
									mkaccount.value.error = resp.error;
									return;
								}
								mkaccount.value.error = "アカウントを作成しました!利用可能になるまで時間がかかります";
								dologin.value.userId = mkaccount.value.userId;
								dologin.value.password = mkaccount.value.password;
								dologin.value.exec();
							} catch (exception) {
								mkaccount.value.error = "問題が発生しました: " + exception;
							}
						},
					});
				},
			});

			const dologout = ref({
				error: "",
				trying: false,
				exec: () => {
					localStorage.setItem("SessionId", "");
					dologout.value.error = "ログアウトしました!";
					window.setTimeout(() => window.location.reload(), 1000);
				},
			});

			const chpass = ref({
				error: "",
				trying: false,
				gasUserId: 0,
				gasOldPassword: 0,
				gasNewPassword: 0,
				gasNewPasswordConfirm: 0,
				exec: () => {
				},
			});

			return window.d = {
				loggedIn, dologin, dologout, mkaccount, chpass, username,
			};
		},
	}).mount("#app");
})();
