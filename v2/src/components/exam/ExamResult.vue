<template>
  <div>
    <h2>結果</h2>
    <p>正答数: {{ result.correct }} / {{ result.total }}</p>
    <p>スコア: {{ result.score }}</p>
    <ul>
      <li v-for="(q, i) in result.details" :key="i">
        Q{{ i + 1 }}: あなたの答え「{{ q.user_answer }}」 - 正解「{{ q.correct_answer }}」
        <span :style="{ color: q.is_correct ? 'green' : 'red' }">
          ({{ q.is_correct ? '正解' : '不正解' }})
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const BASE_URL = 'https://script.google.com/macros/s/AKfycbw8lWyor28McmAj4JubiPM8fXX4YdoV0sTaR6-KCGt-e9Y7-GheBIv6ekOKSNmi8H0l/exec';
const route = useRoute();
const result = ref({
  correct: 0,
  total: 0,
  score: 0,
  details: []
});

onMounted(async () => {
  const res = await fetch(`${BASE_URL}?action=getResult&session_id=${route.params.id}`);
  result.value = await res.json();
});
</script>
