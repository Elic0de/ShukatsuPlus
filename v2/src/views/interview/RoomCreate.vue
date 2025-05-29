<!-- src/views/RoomCreate.vue -->
<template>
  <div class="p-4">ルームを作成中...</div>
</template>

<script setup>
import { onMounted, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { postGas } from "@/scripts/gas";

const { state } = inject('auth')
const router = useRouter()
const emit = defineEmits(["set-loading"]);	

const mkroom = ref({
		error: "",
		trying: false,
		id: "",
		name: "新規部屋",
		exec: () => {
			if (mkroom.value.trying) return;
			mkroom.value.trying = true;
			mkroom.value.error = "作成中…";
            emit('set-loading', true)

			const xhr = postGas("/api/0.1/room/create", {
				session_id: state.sessionId,
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
                        emit('set-loading', false)
						router.replace({ name: 'Room', params: { roomId: resp.room_id } })
					} catch (exception) {
						mkroom.value.error = "問題が発生しました: " + exception;
					}
				},
			});
		},
	});

onMounted(() => {
  mkroom.value.exec();
})
</script>
