<template>
  <div class="px-6 pt-4 pb-52">
    <StickyBar/>
    <h2 class="mb-2 border-b-2 py-2 text-2xl font-bold">{{ question.title }}</h2>
    
    <div class="flex flex-col">
        <div class="border-n pb-4 text-xl font-bold text-neutral-500">
          <span>この問題は2問組です。</span>
        </div>
        <div class="text-right">
          <Timer :seconds="totalTime" label="全体タイマー" />
          <Timer :seconds="localTimeLeft" label="問題タイマー" />
        </div>
    </div>

    <div class="sticky top-[30px] mb-2 border-b-2 border-neutral-200 bg-white p-2 leading-7 font-normal">
      <p class="pb-6">{{ part.question }}</p>
    </div>
    
    <div class="space-y-2 pb-4">
      <div
        v-for="(text, key) in part.choices"
        :key="key"
        :class="answers[part.id] === key ? 'option-box-active' : 'option-box'"
        @click="$emit('select', part.id, key)"
      >
        {{ text }}
      </div>
    </div>

  </div>
</template>

<script setup>
    import Timer from './Timer.vue'
    import StickyBar from '@/components/ui/StickyBar.vue'

    const props = defineProps({
        question: Object,
        part: Object,
        answers: Object,
        totalTime: Number,
        localTimeLeft: Number
    })


    defineEmits(['select'])
</script>
