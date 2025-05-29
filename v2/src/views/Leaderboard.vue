<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
    <div v-if="loading">読み込み中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <RankingList :data="rankingData" />
      <UserRank v-if="!isUserInTop" :rank="userRank" :user="userEntry" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RankingList from '@/components/leaderboard/RankingList.vue'
import UserRank from '@/components/leaderboard/UserRank.vue'

const userId = 'user-5'
const displayLimit = 3
const rankingData = ref([])
const loading = ref(true)
const error = ref(null)

const CACHE_KEY = 'ranking_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5分

const loadCache = () => {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  const { timestamp, data } = JSON.parse(raw)
  return (Date.now() - timestamp) < CACHE_TTL ? data : null
}

const saveCache = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    data
  }))
}

// 擬似API（ここをリアルAPIに置き換えてください）
const fetchRankingData = async () => {
  const url = 'https://script.google.com/macros/s/AKfycbw8lWyor28McmAj4JubiPM8fXX4YdoV0sTaR6-KCGt-e9Y7-GheBIv6ekOKSNmi8H0l/exec?action=leaderboard';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // GAS側はJSON形式で返している前提
    const data = await response.json();

    // そのまま返すか、必要に応じて加工
    return data; 
  } catch (error) {
    console.error('Failed to fetch ranking data:', error);
    return [];  // エラー時は空配列を返すなどのフォールバックも検討
  }
};


onMounted(async () => {
  try {
    const cached = loadCache()
    if (cached) {
      rankingData.value = cached
    } else {
      const data = await fetchRankingData()
      rankingData.value = data
      saveCache(data)
    }
  } catch (e) {
    error.value = 'データの読み込みに失敗しました'
  } finally {
    loading.value = false
  }
})

const sortedRanking = computed(() =>
  [...rankingData.value].sort((a, b) => b.score - a.score)
)

const topRankings = computed(() =>
  sortedRanking.value.slice(0, displayLimit)
)

const userRank = computed(() =>
  sortedRanking.value.findIndex(user => user.id === userId) + 1
)

const userEntry = computed(() =>
  sortedRanking.value.find(user => user.id === userId)
)

const isUserInTop = computed(() => userRank.value <= displayLimit)
</script>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}
</style>