<template>
  <div>
    <LeaderboardItem
      v-for="(user, index) in users"
      :key="user.id"
      :user="user"
      :rank="index + 1"
    />
  </div>
</template>

<script setup>
import LeaderboardItem from './LeaderboardItem.vue'
const props = defineProps({ users: Array })
</script>