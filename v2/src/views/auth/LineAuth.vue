<template></template>

<script setup>
    import { watch } from "vue";
	import { useLiff } from "@/composables/useLiff";
	import { useSessionStore } from "@/stores/session";

	const { login, getIdToken, isReady } = useLiff();
	const store = useSessionStore();

    watch(isReady, async (ready) => {
        if (ready) {
            login();
            const idToken = getIdToken();
            if (idToken) {
                const response = await postIdTokenToGAS(idToken);
                store.login(response.sessionId, response.userId);
            }
        }
    });
</script>
