<template>
  <div>
    <QuestionSection
      v-if="!result"
      :question="currentQuestion"
      :part="currentPart"
      :answers="answers"
      :localTimeLeft="localTimeLeft"
      :totalTime="totalTime"
      @select="selectOption"
    />

    <ExamResult v-else :result="result" />

    <QuestionNavigation
      v-if="!result"
      :question="currentQuestion"
      :selectedPartIndex="selectedPartIndex"
      @selectPart="selectedPartIndex = $event"
      @next="goToNextQuestion"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuestionSection from './question/QuestionSection.vue'
import QuestionNavigation from './question/QuestionNavigation.vue'
import ExamResult from '@/views/exam/ExamResult.vue'

//console.log(props.questions)

const props = defineProps({
    currentQuestionIndex: Number,
    questions: Array,
    answers: Object,
    result: Object,
    localTimeLeft: Number,
    totalTime: Number
})

const emit = defineEmits(['select', 'next'])

const selectedPartIndex = ref(0)


const currentQuestion = computed(() => 
    props.questions[props.currentQuestionIndex]

)

const currentPart = computed(() =>
  currentQuestion.value?.parts[selectedPartIndex.value]
)

function selectOption(partId, optionKey) {
  emit('select', partId, optionKey)
}

function goToNextQuestion() {
  selectedPartIndex.value = 0
  emit('next')
}
</script>
