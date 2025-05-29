<template>
  <div class="flex items-center justify-between p-4 border-b border-gray-200">
    <div class="text-lg font-medium text-gray-800">
      {{ item.rank }}位: {{ item.name || 'Unknown User' }}
    </div>
    <div class="text-sm text-gray-600">
      スコア: {{ item.score }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
