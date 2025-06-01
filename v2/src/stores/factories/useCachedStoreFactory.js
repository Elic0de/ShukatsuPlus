import { ref, computed } from "vue";
import { setWithExpiry, getWithExpiry } from "@/utils/storage";

const CACHE_TTL = 1000 * 60 * 60 * 24; // 24時間

export function createCachedStore(keyName, fetchFunction) {
	const data = ref(getWithExpiry(keyName) || null);
	const isLoading = ref(false);
	const error = ref(null);

	const load = async () => {
		isLoading.value = true;
		error.value = null;
		try {
			if (data.value) return data.value;

			const result = await fetchFunction();
			data.value = result;
			setWithExpiry(keyName, result, CACHE_TTL);
		} catch (err) {
			error.value = err.message || `${keyName} の読み込みに失敗しました`;
		} finally {
			isLoading.value = false;
		}
	};

	const isLoaded = computed(() => !!data.value);

	return {
		data,
		isLoading,
		error,
		load,
		isLoaded,
	};
}
