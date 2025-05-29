<template>
  <div class="min-h-screen bg-white">
    <RoleplayFeedback />
    <MessageContainer :messages="data.messages" />
    <NextButton />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MessageContainer from '@/components/interview/MessageContainer.vue'
import NextButton from '@/components/interview/NextButton.vue'
import RoleplayFeedback from '@/components/interview/RoleplayFeedback.vue'


const data = ref({})

onMounted(() => {
  // 疑似的なJSON読み込み
  data.value = {
    messages: [
      {
        speaker: 'user',
        text: 'リアルではなく、大きな食事が好きです。おいしいものを食べましょう、お願いします。',
        subtext: null,
        isCorrect: false
      },
      {
        speaker: 'system',
        text: 'Fine, but I hope it’s not too fancy. What do you want?',
        subtext: null,
        isCorrect: false
      },
      {
        speaker: 'user',
        text: 'I want a hamburger with cheese and fries, big salad please',
        subtext: "より丁寧に聞くために、I'd like a hamburger with cheese and fries, please と言うことができます。",
        isCorrect: true
      },
      {
        speaker: 'system',
        text: 'Okay, let\'s get the food. I guess it’s not cereal.',
        subtext: null,
        isCorrect: false
      }
    ]
  }
})
</script>