<template>
  <button class="w-[30px] h-[30px] rounded-[10px] bg-neutral-100 flex justify-center items-center mr-1.5">
    <img :src="iconUrl" alt="icon" class="w-[18px] h-[18px]" />
  </button>
</template>

<script setup>
defineProps({
  iconUrl: String
})
</script>
