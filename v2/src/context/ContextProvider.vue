<script setup>
import { provide, reactive, onMounted } from 'vue'
import AccountManager from '@/components/auth/AccountManager.vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const state = reactive({
  sessionId: null,
  userId: null,
  isAuthenticated: false,
})

// APIでログイン
function login(userId, sessionId) {
    state.userId = userId
    state.sessionId = sessionId
    state.isAuthenticated = true

    // 永続化
    localStorage.setItem('sessionId', sessionId)
    localStorage.setItem('userId', userId)
}

// ログアウト
function logout() {
  state.userId = null
  state.sessionId = null
  state.isAuthenticated = false
  localStorage.removeItem('sessionId')
  localStorage.removeItem('userId')
}

onMounted(() => {
  const savedSessionId = localStorage.getItem('sessionId')
  const savedUserId = localStorage.getItem('userId')

  if (savedSessionId && savedUserId) {
    state.sessionId = savedSessionId
    state.userId = savedUserId
    state.isAuthenticated = true
  }

  // if (route.path === '/' && state?.sessionId) {
  //   router.replace('/lesson')
  // }
})

provide('auth', {
  state,
  login,
  logout,
})
</script>

<template>
    <slot v-if="state.isAuthenticated" ></slot>
    <AccountManager v-else />
</template>
