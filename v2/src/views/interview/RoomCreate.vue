<!-- src/views/RoomCreate.vue -->
<template>
	<LoadingV2/>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import { useRouter } from "vue-router";
	import { postGas } from "@/scripts/gas";
	import LoadingV2 from "@/components/ui/LoadingV2.vue";
	import { useSessionStore } from "@/stores/session";

	const router = useRouter();
	const store = useSessionStore();

	const mkroom = ref({
		error: "",
		trying: false,
		id: "",
		name: "新規部屋",
		exec: () => {
			if (mkroom.value.trying) return;
			mkroom.value.trying = true;
			mkroom.value.error = "作成中…";

			const xhr = postGas(
				"/api/0.1/room/create",
				{
					session_id: store.data.value.sessionId,
					name: mkroom.value.name || "新規部屋",
				},
				{
					loadend: () => {
						mkroom.value.trying = false;
					},
					abort: () => {
						mkroom.value.error = "問題が発生しました";
					},
					error: () => {
						mkroom.value.error = "問題が発生しました";
					},
					load: () => {
						try {
							// 仕様上HTTPレスポンスコードは基本的に200しか返さないため
							// レスポンスボディーを見る
							const resp = JSON.parse(xhr.responseText);
							if ("error" in resp) {
								mkroom.value.error = resp.error;
								return;
							}
							router.replace({
								name: "Room",
								params: { roomId: resp.room_id },
							});
						} catch (exception) {
							mkroom.value.error =
								"問題が発生しました: " + exception;
						}
					},
				}
			);
		},
	});

	onMounted(() => {
		mkroom.value.exec();
	});
</script>
