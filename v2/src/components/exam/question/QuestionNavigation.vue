<template>
  <nav class="fixed bottom-0 z-50 w-full border-t-2 border-neutral-200 bg-white">
    <div v-if="question.parts.length > 1" class="flex gap-2 px-4 pt-4">
      <button
        v-for="(part, idx) in question.parts"
        :key="part.id"
        :class="selectedPartIndex === idx ? 'btn-page-active' : 'btn-page'"
        @click="$emit('selectPart', idx)"
      >
        問{{ idx + 1 }}
      </button>
    </div>
    <div class="px-4 py-4">
      <button @click="$emit('next')" class="btn-next">
        <span>次へ</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
    const props = defineProps({
        question: Object,
        selectedPartIndex: Number
    })

    defineEmits(['selectPart', 'next'])
</script>
