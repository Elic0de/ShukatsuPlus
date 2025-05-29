<!-- components/RecentCallItem.vue -->
<template>
  <RouterLink :to="`/room/${roomId}`">
    <div class="border-b last:border-none py-3">
        <div class="text-[19px] font-bold text-neutral-600 mb-2">{{ name }}</div>
        <div class="text-xs text-neutral-400">{{ formattedDate }}</div>
    </div>
   </RouterLink>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  name: String,
  roomId: String,
  createdAt: String
});

const formattedDate = computed(() => {
  const date = new Date(props.createdAt);
  return date.toLocaleString('ja-JP', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
});
</script>