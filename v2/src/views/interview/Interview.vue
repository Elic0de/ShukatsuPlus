<template>
	<div class="font-sans min-h-screen bg-white">
		<CallUserCard
			name="リリー"
			avatar="/avatar.png"
			@click="goToCreateRoom"
		/>
		<div class="px-4 py-6">
			<h2 class="text-neutral-400 text-xl mb-2">最近</h2>
			<p v-if="updating" class="text-center">更新中…</p>
			<RecentCallItem
				v-for="item in rooms"
				:key="item.room_id"
				:name="item.name"
				:room-id="item.room_id"
				:created-at="item.created_at"
			/>
		</div>
	</div>
</template>

<script setup>
	import { ref, nextTick } from "vue";
	import { postGas } from "@/scripts/gas";
	import { useRouter } from "vue-router";
	import { useSessionStore } from "@/stores/session";

	import CallUserCard from "@/components/interview/CallUserCard.vue";
	import RecentCallItem from "@/components/interview/RecentCallItem.vue";

	const CACHE_KEY = "room_list_cache";
	const CACHE_TTL_MS = 60 * 60 * 1000; // 1時間

	const emit = defineEmits(["callbackMeWhenActive"]);

	const session = useSessionStore();

	const isSessionValid = session.isSessionValid;

	const selectedRoomId = ref("");
	const talkTitle = ref("");

	const rooms = ref([]);
	const error = ref("");
	const updating = ref(false);

	/**
	 * キャッシュから部屋一覧を取得
	 */
	function loadRoomsFromCache() {
		const cacheRaw = localStorage.getItem(CACHE_KEY);
		if (!cacheRaw) return null;
		try {
			const { data, expires } = JSON.parse(cacheRaw);
			if (Date.now() > expires) {
				localStorage.removeItem(CACHE_KEY);
				return null;
			}
			return data;
		} catch {
			localStorage.removeItem(CACHE_KEY);
			return null;
		}
	}

	/**
	 * 部屋一覧をキャッシュに保存
	 */
	function saveRoomsToCache(data) {
		const cache = {
			data,
			expires: Date.now() + CACHE_TTL_MS,
		};
		localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
	}

	/**
	 * 部屋一覧をAPIから取得し、キャッシュも更新
	 */
	function fetchRoomsFromApi() {
		updating.value = true;
		error.value = "部屋一覧を取得中…";

		const xhr = postGas(
			"/api/0.1/room/query_user",
			{
				session_id: session.data.value.sessionId,
			},
			{
				loadend: () => {
					updating.value = false;
				},
				abort: () => {
					error.value = "問題が発生しました";
				},
				error: () => {
					error.value = "問題が発生しました";
				},
				load: () => {
					try {
						const resp = JSON.parse(xhr.responseText);
						if ("error" in resp) {
							error.value = resp.error;
							return;
						}
						error.value = "";
						rooms.value = resp;
						saveRoomsToCache(resp);
					} catch (exception) {
						error.value = "問題が発生しました: " + exception;
					}
				},
			}
		);
	}

	/**
	 * 部屋一覧をキャッシュ優先で取得
	 */
	function updateRoomList() {
		if (!isSessionValid.value) {
			rooms.value = [];
			error.value = "ログインしてください";
			return;
		}
		if (updating.value) return;

		const cached = loadRoomsFromCache();
		if (cached) {
			rooms.value = cached;
			error.value = "";
			return;
		}
		fetchRoomsFromApi();
	}

	const changeRoomId = (v) => {
		selectedRoomId.value = v;
	};

	const onTalkTitleChanged = (v) => {
		talkTitle.value = v;
	};

	const updateRoomListIfEmpty = () => {
		if (isSessionValid.value && rooms.value.length === 0) {
			updateRoomList();
		}
	};

	nextTick(() => {
		updateRoomListIfEmpty();
	});

	const router = useRouter();

	const goToCreateRoom = () => {
		router.push({ name: "RoomCreate" });
	};
</script>
