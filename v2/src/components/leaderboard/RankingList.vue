<template>
  <div class="bg-white rounded-xl shadow-md p-6 space-y-2">
    <h2 class="text-2xl font-semibold mb-4">ランキング</h2>
    <RankingItem
      v-for="(item, index) in data"
      :key="index"
      :item="item"
    />
  </div>
</template>

<script setup>
import RankingItem from './RankingItem.vue';

defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>
