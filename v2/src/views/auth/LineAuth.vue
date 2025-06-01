<template></template>

<script setup>
	import { onMounted } from "vue";

	import { useLiff } from "@/composables/useLiff";
	const { login, getIdToken } = await useLiff();
	onMounted(async () => {
		login();

		const idToken = getIdToken();

		if (idToken) {
			const response = await postIdTokenToGAS(idToken);

			// authStore.setSession({
			//     sessionId: response.sessionId,
			//     userName: profile.displayName,
			//     userId: profile.userId,
			// });
		}
	});
</script>
