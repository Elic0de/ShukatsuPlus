<template>
</template>

<script setup>
    import { onMounted } from "vue";
    import { useLiff } from "@/composables/useLiff";
    import { useSessionStore } from '@/stores/session'
    
    const { login, getIdToken } = useLiff();
    const store = useSessionStore();

    onMounted(async () => {
        login();

        const idToken = getIdToken();

         if (idToken) {
            const response = await postIdTokenToGAS(idToken);
            
            store.login(response.sessionId, response.userId);
            // authStore.setSession({
            //     sessionId: response.sessionId,
            //     userName: profile.displayName,
            //     userId: profile.userId,
            // });
        }
    })
</script>