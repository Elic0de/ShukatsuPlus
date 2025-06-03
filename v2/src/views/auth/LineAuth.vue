<template>
	<LoadingV2/>
</template>

<script setup>
    import { watch } from "vue";
    import { useAuth } from "@/composables/useAuth";
    import router from "@/router";
    import LoadingV2 from "@/components/ui/LoadingV2.vue";

    const { isReady, authenticateWithLiff } = useAuth();

    watch(isReady, async (ready) => {
        if (ready) {
            try {
                await authenticateWithLiff();
                router.push("/");
            } catch (e) {
                console.error("認証エラー:", e);
            }
        }
    });
</script>
