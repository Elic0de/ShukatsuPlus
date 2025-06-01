<template>
  <div class="mx-auto max-w-3xl rounded-lg bg-white p-4 text-neutral-700 shadow-md border border-neutral-200">
    <h2 v-if="titleText" class="text-sm font-semibold text-neutral-500 mb-2">
      {{ titleText }}
    </h2>
    <p class="text-sm leading-relaxed whitespace-pre-wrap">
      {{ summaryText }}
    </p>

    <!-- slotでカスタム挿入も可能 -->
    <slot />
  </div>
</template>

<script setup>
// Propsを定義
defineProps({
  titleText: {
    type: String,
    default: '面接全体のサマリー'
  },
  summaryText: {
    type: String,
    required: true
  }
})
</script>
