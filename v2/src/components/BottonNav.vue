<template>
    <nav class="fixed bottom-0 w-full bg-white border-t-2 border-indigo-50" style="z-index: 215;">
      <div class="align-middle flex justify-between box-border p-4 gap-3">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          :class="[
            isActive(item.link)
              ? 'bg-indigo-50 rounded-lg border-2 border-indigo-200'
              : ''
          ]"
        >
          <router-link :to="item.link">
            <div class="flex relative p-2 text-2xl">
              <i v-bind:class="'fa fa-' + item.fa" aria-hidden="true"></i>
              <!-- <img :src="item.icon" alt="" class="_3J4we" /> -->
            </div>
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const menuItems = [
    { link: '/lesson', icon: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/fbe0c187341c280e161f76fb4cbda1d7.svg', fa: 'home'  },
    { link: '/spi', icon: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/882b3d3e43fc041d51f6fc2af496e617.svg', fa: 'pencil' },
    { link: '/interview', icon: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/3b4928101472fce4e9edac920c1b3817.svg', fa: 'comments' },
    { link: '/leaderboard', icon: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/d1f31f71a5b1d513184cc278d910cb33.svg', fa: 'users' },
    { link: '/profile', icon: 'https://d35aaqx5ub95lt.cloudfront.net/vendor/e93ac282acf802a6258c761d3e9f9888.svg', fa: 'user' }
  ];
  
  const isActive = (path) => route.path === path;
  </script>
  

  