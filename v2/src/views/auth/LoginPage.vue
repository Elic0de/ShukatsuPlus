<script setup>
import { ref, computed } from "vue";
import { postGas } from "@/scripts/gas";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import LoadingIndicator from "@/components/LoadingIndicator.vue";

import { useSessionStore } from '@/stores/session'
import router from "@/router";

const store = useSessionStore()
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

                                            store.login(resp2["session_id"], dologin.value.userId);
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
    <div class="flex justify-center items-center w-full relative p-7.5 bg-white">
        <form class="mt-10 relative text-center" @submit.prevent="dologin.exec">
            <div>
                <h1 class="text-2xl text-center font-bold mt-2.5 mb-3.75">ログイン</h1>
                <div class="flex flex-col text-2xl relative text-start w-full">
                    <div class="mt-2 w-full inline-flex flex-col gap-4">
                        <div
                            class="mt-2 w-full bg-neutral-50 border-2 rounded-xl border-neutral-200 flex overflow-hidden ">
                            <input class="px-3.5 py-2 w-full shadow-none caret-blue-200" v-model="dologin.userId" v-bind:readonly="someTrying"
                                placeholder="ユーザ名">
                        </div>
                        <div
                            class="mt-2 w-full bg-neutral-50 border-2 rounded-xl border-neutral-200 flex overflow-hidden ">
                            <input class="px-3.5 py-2 w-full shadow-none caret-blue-200" v-model="dologin.password" v-bind:readonly="someTrying"
                                placeholder="パスワード">
                        </div>
                    </div>
                    <button
                        class="mt-5 w-full rounded-2xl bg-blue-300 text-white px-4 h-12.5 border-b-4 border-blue-400"
                        v-bind:disabled="someTrying"
                    >
                        <span>ログイン</span>
                    </button>
                    <p class="error">
                        <LoadingIndicator v-bind:show="dologin.trying" /> {{ dologin.error }}
                    </p>
                    <div class="items-center flex justify-center mt-5">
                        <div class="bg-neutral-300 h-0.25 flex-grow"></div>
                        <div class="text-neutral-300 flex-grow-0 px-2 text-[15px] font-bold">または</div>
                        <div class="bg-neutral-300 h-0.25 flex-grow"></div>
                    </div>
                    <p class="gap-4 grid mt-5">
                        <button
                            class="mt-5 w-full rounded-2xl bg-white-300 text-white px-4 h-12.5 border-b-4 border-neutral-100 border-2 items-center justify-center relative inline-flex ">
                            <img src="" alt="">
                            <span class="text-green-300">LINE</span>
                        </button>
                    </p>
                </div>
            </div>
            <div class="items-center flex flex-col pb-2.5 pt-10">
                <div class="mb-5 text-neutral-400 text-sm">
                    <span>
                        ログインすると就活対策の利用規約とプライバシーポリシーに同意したことになります。
                    </span>
                </div>
                <div class="font-bold text-neutral-500">
                    アカウントをお持ちではないですか?
                    <span class="text-blue-400 cursor-pointer ml-1.25 text-[15px]">登録</span>
                </div>
            </div>
        </form>
    </div>
</template>

