<template>
  <div
    :class="[
      'max-w-xs px-4 py-2 rounded-lg shadow',
      role === 'user'
        ? 'bg-blue-500 text-white self-end ml-auto'
        : 'bg-gray-300 text-gray-900 self-start mr-auto'
    ]"
  >
    {{ content }}
  </div>
</template>

<script setup>
defineProps(['role', 'content'])
</script>
