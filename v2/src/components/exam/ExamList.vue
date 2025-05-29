<template>
  <div>
    <h2>受験可能な試験一覧</h2>
    <button @click="fetchExams">試験一覧を更新</button>
    <ul v-if="exams.length">
      <li v-for="exam in exams" :key="exam.exam_id">
        {{ exam.title }}
        <button @click="startExam(exam.exam_id)">受験開始</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const CACHE_KEY = 'examListCache'
const CACHE_EXPIRY_KEY = 'examListExpiry'

const exams = ref([])
const router = useRouter()
const { state } = inject('auth')


const BASE_URL = "https://script.google.com/macros/s/AKfycbw8lWyor28McmAj4JubiPM8fXX4YdoV0sTaR6-KCGt-e9Y7-GheBIv6ekOKSNmi8H0l/exec";


async function fetchExams() {
  try {
    const res = await fetch(`${BASE_URL}?action=getExams`)
    const data = await res.json()
    exams.value = data
    // キャッシュの更新：1時間後に期限切れ
    const expiry = new Date().getTime() + 60 * 60 * 1000
    localStorage.setItem(CACHE_KEY, JSON.stringify(exams.value))
    localStorage.setItem(CACHE_EXPIRY_KEY, expiry)
  } catch (error) {
    console.error('Error fetching exams:', error)
  }
}

function getCachedExams() {
  const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
  if (expiry && new Date().getTime() < Number(expiry)) {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      exams.value = JSON.parse(cached)
      return
    }
  }
  fetchExams()
}

async function startExam(examId) {
  try {
    const startRes = await fetch(`${BASE_URL}?action=startExam&user_id=${state.userId}&exam_id=${examId}`);
    const startData = await startRes.json();
    if (startData.error) {
      return;
    }
    router.push(`/spi/${startData.session_id}`)
  } catch (error) {
    console.error("Error starting exam:", error);
  }
}

onMounted(() => {
  getCachedExams()
})
</script>

<style scoped>
/* 必要に応じてスタイルを追加してください */
</style>