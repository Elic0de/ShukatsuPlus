import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/apis/apiFactory";
import { setWithExpiry, getWithExpiry } from "@/utils/storage";

const CASHE_TTL = 1000 * 60 * 60 * 24; // 24時間

export const useLeaderboardStore = defineStore("leaderboard", () => {
	const leaderboard = ref(getWithExpiry("leaderboard") || null);
	const isLoading = ref(false);
	const error = ref(null);

	const loadLeaderboard = async () => {
		isLoading.value = true;
		error.value = null;
		try {
			if (leaderboard.value) {
				return leaderboard.value;
			}
			const result = await api.fetchLeaderboard();
			leaderboard.value = result;
			setWithExpiry("leaderboard", result, CASHE_TTL);
		} catch (err) {
			error.value =
				err.message || "リーダーボードの読み込みに失敗しました";
		} finally {
			isLoading.value = false;
		}
	};

	const isLoadeded = computed(() => !!leaderboard.value);

	return {
		leaderboard,
		isLoading,
		error,
		loadLeaderboard,
		isLoadeded,
	};
});
