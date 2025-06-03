// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const id = ref(null)
  const name = ref('Guest')
  const email = ref(null)
  const avatar = ref(null)
  const joinedAt = ref(new Date())

  const isLoggedIn = computed(() => id.value !== null)

  const updateUser = (updates) => {
    if (updates.id !== undefined) id.value = updates.id
    if (updates.name !== undefined) name.value = updates.name
    if (updates.email !== undefined) email.value = updates.email
    if (updates.avatar !== undefined) avatar.value = updates.avatar
	joinedAt.value = new Date()
  }

  const clearUser = () => {
    id.value = null
    name.value = 'Guest'
    email.value = null
    avatar.value = null
  }

  return {
    id,
    name,
    email,
    avatar,
	joinedAt,
    isLoggedIn,
    updateUser,
    clearUser
  }
}, {
  persist: true
})
