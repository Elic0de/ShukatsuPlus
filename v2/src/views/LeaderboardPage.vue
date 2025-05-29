<script setup>
import { ref, onMounted } from 'vue'
import LeaderboardItem from '@/components/leaderboard/new/LeaderboardItem.vue'
import LeaderboardSkeleton from '@/components/leaderboard/new/LeaderboardSkeleton.vue'

// ダミーデータ（実際はAPIから取得）
const leaderboard = ref([])
const currentUserId = 42 // 自分のユーザーID（ログイン状態から取得する想定）
const isLoading = ref(true)

onMounted(async () => {
  // 実際はAPIから取得
  await new Promise(resolve => setTimeout(resolve, 1500)) // ローディング演出用
  leaderboard.value = [
    { id: 1, username: 'Alice', score: 2500 },
    { id: 2, username: 'Bob', score: 2400 },
    { id: 3, username: 'Carol', score: 2300 },
    { id: 4, username: 'You', score: 2200, id: currentUserId },
    { id: 5, username: 'Eve', score: 2100 },
  ]
  isLoading.value = false
})
</script>

<template>
  <div class="m-0 flex w-full flex-col pb-20 text-center">
    <!-- ヘッダー -->
    <div class="sticky z-10 bg-white">
      <div class="mt-6 mb-5 text-[25px] font-bold">リーダーボード</div>
      <div class="mb-4 h-6.5 items-center">
        <hr class="h-0 border-0 border-t-2 border-neutral-200" />
      </div>
    </div>

    <!-- 本体 -->
    <div class="flex flex-col">
      <!-- ローディング中 -->
      <LeaderboardSkeleton v-if="isLoading" :count="5" />

      <!-- リスト表示 -->
      <LeaderboardItem
        v-else
        v-for="(item, index) in leaderboard"
        :key="item.id"
        :rank="index + 1"
        :username="item.username"
        :score="item.score"
        :highlight="item.id === currentUserId"
      />
    </div>
  </div>
</template>
