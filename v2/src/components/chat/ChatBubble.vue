<template>
  <div
    class="flex mb-2"
    :class="bubbleAlignment"
  >
    <div
      class="max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm whitespace-pre-wrap"
      :class="bubbleStyle"
    >
      {{ text }}
    </div>
  </div>
</template>

import

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
  type: 'question' | 'answer'
}>()

const bubbleAlignment = computed(() => {
  return props.type === 'question' ? 'justify-start' : 'justify-end'
})

const bubbleStyle = computed(() => {
  return props.type === 'question'
    ? 'bg-gray-200 text-black rounded-bl-none'
    : 'bg-green-400 text-white rounded-br-none'
})

