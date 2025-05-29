<template>
  <div class="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
    <ChatMessage
      v-for="(msg, idx) in messages"
      :key="idx"
      :role="msg.role"
      :content="msg.content"
    />
  </div>
</template>

<script setup>
import ChatMessage from './ChatMessage.vue'
defineProps(['messages'])
</script>
