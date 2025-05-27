<script setup>
	import { ref, computed } from "vue";
	import Header from "./Header.vue";
	import { postGas } from "@/scripts/gas";
	import { useToast } from 'vue-toast-notification';
	import 'vue-toast-notification/dist/theme-sugar.css';
	import LoadingIndicator from "./LoadingIndicator.vue";

	const $toast = useToast();
	const shownTryIds = {};

	defineEmits(["continue"]);
	const sessionId = defineModel("sessionId");
	const username = defineModel("username");

	const isLoggedIn = computed(() => !!sessionId.value);

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
							dologin.value.trying = false;
							return;
						}
						const intv = window.setInterval(() => {
							const err = (e) => {
								clearInterval(intv);
								dologin.value.error = "問題が発生しました: " + e;
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
											if (!(resp["try_id"] in shownTryIds)) {
												clearInterval(intv);
												shownTryIds[resp["try_id"]] = true;
												dologin.value.error = "";
												$toast.success("ログインしました!", { position: "top" });
												sessionId.value = resp2["session_id"];
												username.value = dologin.value.userId;
												dologin.value.trying = false;
											}
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
			mkaccount.value.error = "作成中…";

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
			sessionId.value = username.value = "";
			dologout.value.error = "";
			$toast.success("ログアウトしました!", { position: "top" });
		},
	});

	const someTrying = computed(() => mkaccount.value.trying || dologin.value.trying || dologout.value.trying);
</script>

<template>
	<Header text="アカウント管理"></Header>
	<div v-if="!isLoggedIn">
		<span class="muted">現在ログインしていません</span>
		<form @submit.prevent="dologin.exec">
			<h2>ログイン</h2>
			<label class="display-block">ユーザーID <small>半角英数字と"_"のみで3~16文字</small><br /><input type="text" class="textbox" v-model="dologin.userId" v-bind:readonly="someTrying" /></label>
			<label class="display-block">パスワード<br /><input type="password" class="textbox" v-model="dologin.password" v-bind:readonly="someTrying" /></label>
			<input class="display-block btn" type="submit" value="ログイン" v-bind:disabled="someTrying" />
			<p class="error"><LoadingIndicator v-bind:show="dologin.trying" /> {{ dologin.error }}</p>
		</form>

		<button @click="$emit('continue')" class="btn line">LINEでログインする</button>

		<form @submit.prevent="mkaccount.exec">
			<h2>アカウント作成</h2>
			<label class="display-block">ユーザーID <small>半角英数字と"_"のみで3~16文字</small><br /><input type="text" class="textbox" v-model="mkaccount.userId" v-bind:readonly="someTrying" /></label>
			<label class="display-block">パスワード<br /><input type="password" class="textbox" v-model="mkaccount.password" v-bind:readonly="someTrying" /></label>
			<label class="display-block">パスワード(確認)<br /><input type="password" class="textbox" v-model="mkaccount.passwordConfirm" v-bind:readonly="someTrying" /></label>
			<input class="display-block btn" type="submit" value="作成" v-bind:disabled="someTrying" />
			<p class="error"><LoadingIndicator v-bind:show="mkaccount.trying" /> {{ mkaccount.error }}</p>
		</form>
	</div>
	<div v-else>
		<span>現在 <b>{{ username }}</b> としてログインしています <small class="muted">セッションID: {{ sessionId }}</small></span>
		<form @submit.prevent="dologout.exec">
			<input class="display-block btn" type="submit" value="ログアウト"
				v-bind:disabled="someTrying" />
			<p class="error"><LoadingIndicator v-bind:show="dologout.trying" /> {{ dologout.error }}</p>
		</form>
	</div>
</template>

<style scoped>
	.line {
		filter: hue-rotate(-50deg);
		display: block;
	}
</style>
