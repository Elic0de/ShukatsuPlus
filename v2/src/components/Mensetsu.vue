<script setup>
	import { ref, computed } from "vue";
	import Header from "./Header.vue";
	import Talk from "./Talk.vue";
	import { postGas } from "@/scripts/gas";
	import LoadingIndicator from "./LoadingIndicator.vue";

	const emit = defineEmits(["callbackMeWhenActive"]);

	const props = defineProps({
		sessionId: { type: String, required: true },
		username: { type: String, required: true },
	});
	const isLoggedIn = computed(() => !!props.sessionId);

	const selectedRoomId = ref("");
	const talkTitle = ref("");

	const headerText = computed(() => !isLoggedIn.value ? "ログインしてください" : (selectedRoomId.value === "" ? "部屋を選択してください" : talkTitle.value));

	const rooms = ref([]);
	const error = ref("");
	const updating = ref(false);

	const updateRoomList = () => {
		console.log(isLoggedIn.value + "lplplplp")
		if (!isLoggedIn.value) {
			rooms.value = [];
			error.value = "ログインしてください";
			return;
		}

		if (updating.value) return;
		updating.value = true;
		error.value = "部屋一覧を取得中…";

		const xhr = postGas("/api/0.1/room/query_user", {
			session_id: props.sessionId,
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
				session_id: props.sessionId,
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

	const changeRoomId = (v) => {
		selectedRoomId.value = v;
	};

	const onTalkTitleChanged = (v) => {
		talkTitle.value = v;
	}

	const updateRoomListIfEmpty = () => {
		if (isLoggedIn.value && rooms.value.length === 0) {
			updateRoomList();
		}
	};

	defineExpose({
		updateRoomList,
		updateRoomListIfEmpty,
	});
</script>

<template>
	<Header v-bind:text="headerText"></Header>
	<div v-if="!isLoggedIn">
		<p>ナビゲーションバーの「アカウント」からログインできます。(デバッグ用のユーザー ID: dev20 パスワード: 0)</p>
	</div>
	<div v-else-if="selectedRoomId === ''">
		<form @submit.prevent="mkroom.exec">
			<input type="text" class="textbox" v-model="mkroom.name" v-bind:readonly="mkroom.trying" />
			<input style="margin-left: 4px;" class="btn" type="submit" value="部屋を作成" v-bind:disabled="mkroom.trying" />
			<LoadingIndicator v-bind:show="mkroom.trying" /> {{ mkroom.error }}
		</form>
		<button @click="updateRoomList" v-if="!updating" class="btn" v-bind:disabled="mkroom.trying"><i class="fa fa-refresh" aria-hidden="true"></i> 部屋一覧を更新</button>
		<p><LoadingIndicator v-bind:show="updating" /> {{ error }}</p>

		<ul>
			<li v-for="room in rooms">
				<a href="" @click.prevent="changeRoomId(room['room_id'])">{{ room["name"] || "<無名>" }}</a>
			</li>
		</ul>
	</div>
	<Talk v-else @change-title="onTalkTitleChanged" @require-go-back="selectedRoomId = ''" :room-id="selectedRoomId" :session-id="sessionId" :username="username"></Talk>
</template>
