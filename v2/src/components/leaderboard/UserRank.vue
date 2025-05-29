<template>
  <div class="user-rank">
    あなたの順位は <strong>{{ rank }}位</strong> です！（{{ user.name }}: {{ user.score }}点）
  </div>
</template>

<script setup>
defineProps({
  rank: Number,
  user: Object
})
</script>

<style scoped>
.user-rank {
  margin-top: 1rem;
  font-weight: bold;
  color: #336699;
}
</style>