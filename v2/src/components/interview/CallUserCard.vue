<!-- components/CallUserCard.vue -->
<template>
  <div class="bg-gradient-to-t from-purple-900 from- via-purple-800 via- to-violet-400 to- text-white p-6">
    <div class="flex flex-col items-center">
      <span class="text-lg font-bold">面接練習</span>
      <button
        @click="onCall"
        class="mt-5 w-full rounded-2xl bg-white text-purple-800 px-4 h-12.5 border-b-4 border-neutral-400"
      >
        面接練習をする 
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  name: String,
  avatar: String
});

const emit = defineEmits(['call']);

const onCall = () => {
  emit('call');
};
</script>