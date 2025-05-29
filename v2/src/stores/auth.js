import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/apis/apiFactory'
import { setWithExpiry, getWithExpiry, removeItem } from '@/utils/storage'

const SESSION_TTL = 1000 * 60 * 60 * 24 // 24時間

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getWithExpiry('user') || null)
  const token = ref(getWithExpiry('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  const login = async (userId, password) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await api.login(userId, password)
      token.value = result.token
      user.value = result.user
      setWithExpiry('token', result.token, SESSION_TTL)
      setWithExpiry('user', result.user, SESSION_TTL)
    } catch (err) {
      error.value = err.message || 'ログインに失敗しました'
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    removeItem('token')
    removeItem('user')
  }

  const isLoggedIn = computed(() => !!token.value)

  return {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isLoggedIn,
  }
})
