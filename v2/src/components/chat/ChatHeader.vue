<template>
  <div class="p-4 bg-white shadow flex flex-col gap-2">
    <button class="text-blue-500 flex items-center gap-1" @click="$emit('requireGoBack')">
      <i class="fa fa-arrow-left"></i> 部屋選択へ戻る
    </button>
    <a href="#" class="text-sm text-gray-500 hover:underline" @click.prevent="$emit('renameRoom')">
      部屋の名前を変更
    </a>
    <small class="text-gray-400">部屋ID: {{ roomId }}</small>
  </div>
</template>

<script setup>
defineProps(['roomId'])
defineEmits(['requireGoBack', 'renameRoom'])
</script>
