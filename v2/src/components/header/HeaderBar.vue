<template>
  <header class="fixed left-0 top-0 w-full h-14.5 px-2.5 bg-white z-[210] font-medium text-[17px] leading-[25px]">
    <div class="flex justify-between items-center h-full">
      <div class="flex" data-test="courses-menu">
        <HeaderItem iconUrl="https://d35aaqx5ub95lt.cloudfront.net/vendor/87938207afff1598611ba626a8c4827c.svg" />
      </div>
      <StreakInfo />
      <LingotInfo />
      <PremiumLogo />
      <AvatarIcon />
    </div>
  </header>
</template>

<script setup>
import HeaderItem from './HeaderItem.vue'
import StreakInfo from './StreakInfo.vue'
import LingotInfo from './LingotInfo.vue'
import PremiumLogo from './PremiumLogo.vue'
import AvatarIcon from './AvatarIcon.vue'
</script>
