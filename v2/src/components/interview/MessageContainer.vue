<template>
    <div class="space-y-4">
        <ChatMessage v-for="(msg, index) in messages" :key="index" :message="msg" />
    </div>
</template>

<script setup>
import ChatMessage from './ChatMessage.vue'

defineProps({
    messages: Array
})
</script>