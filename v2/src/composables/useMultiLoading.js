// composables/useMultiLoading.js
import { computed } from 'vue'

export function useMultiLoading(...loaders) {
  const isAnyLoading = computed(() => {
    return loaders.some(loader => loader.isLoading.value)
  })

  const isAllLoaded = computed(() => {
    return loaders.every(loader => loader.isLoaded.value)
  })

  const hasAnyError = computed(() => {
    return loaders.some(loader => loader.error.value)
  })

  const loadAll = async () => {
    await Promise.all(loaders.map(loader => loader.load()))
  }

  return {
    isAnyLoading,
    isAllLoaded,
    hasAnyError,
    loadAll,
  }
}
