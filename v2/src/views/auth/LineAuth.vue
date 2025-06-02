<template></template>

<script setup>
    import { watch } from "vue";
	import { useLiff } from "@/composables/useLiff";
	import { useSessionStore } from "@/stores/session";
    import { useUserStore } from "@/stores/user";
    import { api } from "@/apis/apiFactory";
    import router from "@/router";
    
	const { login, getIdToken, isReady } = useLiff();
	const store = useSessionStore();
    const userStore = useUserStore();

    watch(isReady, async (ready) => {
        if (ready) {
            login();
            const idToken = getIdToken();
            console.log(idToken);
            if (idToken) {
                const response = await api.postIdTokenToGAS(idToken);
                store.login(response.sessionId, response.userId);
                userStore.user.value.username = response.userName;
                router.push("/");
            }
        }
    });
</script>
