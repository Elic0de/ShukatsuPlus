<template>
  <div
    :class="[
      'max-w-[85%] p-4 rounded-2xl shadow-md',
      isUser ? 'self-end bg-white text-neutral-900 rounded-br-none' : 'self-start bg-white text-neutral-800 border border-neutral-200 rounded-bl-none'
    ]"
  >
    <div v-if="sender" class="mb-1 text-sm font-semibold" :class="isUser ? 'text-blue-700' : 'text-green-600'">
        {{ sender }}
    </div>
    <div class="text-sm whitespace-pre-wrap">
      {{ message }}
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  isUser: { type: Boolean, default: false } // true: 自分, false: 面接官
})
</script>
