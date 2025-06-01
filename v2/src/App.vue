<script setup>
import { ref, computed } from "vue";
import BottonNav from '@/components/BottonNav.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showBottomNav = computed(() => {
  // showBottomNav が true のときだけ表示、それ以外（undefined含む）は非表示
  return route.meta?.showBottomNav === true;
});

</script>

<template>
  <div class="font-medium text-[17px] leading-[20px] font-sans text-neutral-600">
    <router-view/>
    <BottonNav v-if="showBottomNav" />
  </div>
</template>
