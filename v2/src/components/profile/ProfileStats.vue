<template>
  <div class="">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-neutral-700">学習状況</h2>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <StatCard
        v-for="(stat, index) in stats"
        :key="index"
        :icon-url="stat.iconUrl"
        :value="stat.value"
        :label="stat.label"
      />
    </div>
  </div>
</template>

<script setup>
import StatCard from './StartCard.vue'

defineProps({
  stats: Array
})
</script>
