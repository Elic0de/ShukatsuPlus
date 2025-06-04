import { ref, onMounted } from "vue";

export const useLiff = () => {
	const liffRef = ref(null);
	const isReady = ref(false);

	const login = () => {
		if (liffRef.value && !liffRef.value.isLoggedIn()) {
			liffRef.value.login();
		}
	};

	const getIdToken = () => {
		return liffRef.value?.getIDToken?.();
	};

	onMounted(async () => {
		try {
			const module = await import("@line/liff");
			const liff = module.default;
			await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
			liffRef.value = liff;
			isReady.value = true;
		} catch (e) {
			console.error("LIFF init error", e);
		}
	});

	return {
		login,
		getIdToken,
		isReady,
	};
};
