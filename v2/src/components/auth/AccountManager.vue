<script setup>
import { ref, computed, inject } from "vue";
import { postGas } from "@/scripts/gas";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { useSessionStore } from '@/stores/session'

const store = useSessionStore()
const $toast = useToast();
const shownTryIds = {};

const email = ref('')
const password = ref('')

defineEmits(["continue"]);
const sessionId = defineModel("sessionId");
const username = defineModel("username");

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

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
											
											//login( username.value, sessionId.value);
											store.login(sessionId.value, username.value);
											const redirect = route.query.redirect || '/'
  											router.push(redirect)
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
	<div class="p-6 max-w-md mx-auto">

		<div v-if="!isLoggedIn" class="space-y-8">
			<div>
				<p class="text-gray-500">現在ログインしていません</p>
				<form @submit.prevent="dologin.exec" class="space-y-4">
					<h2 class="text-xl font-semibold">ログイン</h2>

					<label class="block">
						<span class="block text-sm font-medium text-gray-700">ユーザーID</span>
						<small class="text-gray-400">半角英数字と"_"のみで3~16文字</small>
						<input type="text" class="mt-1 w-full border border-gray-300 rounded px-3 py-2"
							v-model="dologin.userId" :readonly="someTrying" />
					</label>

					<label class="block">
						<span class="block text-sm font-medium text-gray-700">パスワード</span>
						<input type="password" class="mt-1 w-full border border-gray-300 rounded px-3 py-2"
							v-model="dologin.password" :readonly="someTrying" />
					</label>

					<input type="submit" value="ログイン"
						class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
						:disabled="someTrying" />
					<p class="text-red-500 text-sm">
						<LoadingIndicator :show="dologin.trying" /> {{ dologin.error }}
					</p>
				</form>
			</div>

			<button @click="$emit('continue')" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
				LINEでログインする
			</button>

			<form @submit.prevent="mkaccount.exec" class="space-y-4">
				<h2 class="text-xl font-semibold">アカウント作成</h2>

				<label class="block">
					<span class="block text-sm font-medium text-gray-700">ユーザーID</span>
					<small class="text-gray-400">半角英数字と"_"のみで3~16文字</small>
					<input type="text" class="mt-1 w-full border border-gray-300 rounded px-3 py-2"
						v-model="mkaccount.userId" :readonly="someTrying" />
				</label>

				<label class="block">
					<span class="block text-sm font-medium text-gray-700">パスワード</span>
					<input type="password" class="mt-1 w-full border border-gray-300 rounded px-3 py-2"
						v-model="mkaccount.password" :readonly="someTrying" />
				</label>

				<label class="block">
					<span class="block text-sm font-medium text-gray-700">パスワード(確認)</span>
					<input type="password" class="mt-1 w-full border border-gray-300 rounded px-3 py-2"
						v-model="mkaccount.passwordConfirm" :readonly="someTrying" />
				</label>

				<input type="submit" value="作成"
					class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
					:disabled="someTrying" />
				<p class="text-red-500 text-sm">
					<LoadingIndicator :show="mkaccount.trying" /> {{ mkaccount.error }}
				</p>
			</form>
		</div>

		<div v-else class="space-y-4">
			<p>
				現在 <b>{{ username }}</b> としてログインしています
				<small class="text-gray-500 block">セッションID: {{ sessionId }}</small>
			</p>

			<form @submit.prevent="dologout.exec">
				<input type="submit" value="ログアウト"
					class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
					:disabled="someTrying" />
				<p class="text-red-500 text-sm">
					<LoadingIndicator :show="dologout.trying" /> {{ dologout.error }}
				</p>
			</form>
		</div>
	</div>
</template>
