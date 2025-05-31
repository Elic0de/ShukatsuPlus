<template>
  <div class="px-4 py-6 text-center">
    <h1 class="mb-4 text-2xl font-bold text-indigo-600">試験終了！</h1>
    <p class="mb-6 text-neutral-600">お疲れさまでした。以下があなたの結果です。</p>

    <!-- スコアカード -->
    <div class="mx-auto mb-6 w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow">
      <div class="mb-2 text-xl font-semibold text-neutral-700">
        得点: <span class="text-2xl text-indigo-600">{{ result.score }} / 100</span>
      </div>
      <div class="text-sm text-neutral-500">正解数: {{ result.correct }} / {{ result.total }} 問</div>
      <div class="text-sm text-neutral-500">所要時間: {{ result.minutes }}分</div>
    </div>
  </div>

  <!-- ナビゲーション -->
  <div class="fixed bottom-0 z-50 w-full border-t-2 border-neutral-200 bg-white shadow-md">
    <div class="flex gap-2 px-4 pt-4">
      <button
        class="h-12 flex-1 rounded-2xl border border-neutral-200 bg-indigo-500 px-2 font-semibold text-white"
        @click="goToReview"
      >
        解説を見る
      </button>
    </div>
    <div class="px-4 py-4">
      <button
        class="h-12 w-full flex-1 rounded-2xl border border-neutral-200 bg-white px-2 font-semibold text-neutral-700"
        @click="goToExamList"
      >
        受験一覧へ戻る
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const sessionId = route.params.sessionId

const props = defineProps({
  result: Object
})

// 解説へ
const goToReview = () => {
  console.log(sessionId)
  router.push(`/spi/review/${sessionId}`)
}

// 一覧へ
const goToExamList = () => {
  router.push('/spi')
}
</script>
