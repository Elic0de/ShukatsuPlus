<template>
  <a class="items-center flex py-2 px-6">
    <img class="size-[42px]" :src="imgSrc" alt="リーグアイコン" />
    <div class="size-[48px] mr-7 ml-3 relative">
      <div class="border-dashed border-2 size-[48px] absolute items-center rounded-full inline-flex justify-center align-middle border-neutral-300 text-neutral-300">
        O
      </div>
    </div>
    <div class="overflow-hidden items-start flex flex-col grow mr-2.5 text-left">
      <span class="font-bold overflow-ellipsis whitespace-nowrap w-full">{{ name }}</span>
    </div>
    <span class="text-neutral-500 mr-2.5 text-right">{{ score }} score</span>
  </a>
</template>

<script setup>
defineProps({
  name: String,
  score: Number,
  imgSrc: {
    type: String,
    default: 'https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9e4f18c0bc42c7508d5fa5b18346af11.svg'
  }
})
</script>
