<template>
  <div class="question-part">
    <p class="question-text">{{ part.question }}</p>
    <div class="choices">
      <label
        v-for="(text, key) in part.choices"
        :key="key"
        class="choice"
      >
        <input
          type="radio"
          :value="key"
          v-model="modelValue"
        />
        {{ text }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  part: {
    id: number
    question: string
    choices: Record<string, string>
  }
  modelValue: string | null
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value)
})
</script>

<style scoped>
.question-part {
  margin-bottom: 1.5rem;
}
.question-text {
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.choice {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
