import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/apis/apiFactory";
import { setWithExpiry, getWithExpiry, removeItem } from "@/utils/storage";

const SESSION_TTL = 1000 * 60 * 60 * 24; // 24時間

export const useUserStore = defineStore("user", () => {
	const user = ref(getWithExpiry("user") || null);
	const isLoading = ref(false);
	const error = ref(null);

	const fetchUser = async () => {
		isLoading.value = true;
		try {
			const res = await api.getUserInfo();
			user.value = res;
			setWithExpiry("user", res, SESSION_TTL);
		} catch (err) {
			console.error(err);
			error.value = "ユーザー情報の取得に失敗しました";
		} finally {
			isLoading.value = false;
		}
	};

	const updateUserName = async (newName) => {
		isLoading.value = true;
		try {
			const res = await api.updateUserName(newName);
			user.value.name = newName;
			setWithExpiry("user", user.value, SESSION_TTL);
		} catch (err) {
			console.error(err);
			error.value = "ユーザー名の更新に失敗しました";
		} finally {
			isLoading.value = false;
		}
	};

	const logout = () => {
		user.value = null;
		removeItem("user");
	};

	const isLoggedIn = computed(() => !!user.value);

	return {
		user,
		isLoading,
		error,
		fetchUser,
		updateUserName,
		logout,
		isLoggedIn,
	};
});
