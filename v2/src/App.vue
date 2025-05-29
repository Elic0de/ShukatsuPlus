<script setup>
import { ref, computed } from "vue";
import Loading from '@/components/Loading.vue'
import BottonNav from '@/components/BottonNav.vue';
import ContextProvider from "@/context/ContextProvider.vue";
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoading = ref(false)
const showBottomNav = computed(() => {
  // showBottomNav が true のときだけ表示、それ以外（undefined含む）は非表示
  return route.meta?.showBottomNav === true;
});

function setLoading(state) {
  isLoading.value = state
}
</script>

<template>
  <ContextProvider> 
    <div class="font-medium text-[17px] leading-[20px] font-sans text-neutral-600">
      <Loading v-if="isLoading" />
      <router-view @set-loading="setLoading" />
      <BottonNav v-if="showBottomNav" />
    </div>
  </ContextProvider>
</template>
