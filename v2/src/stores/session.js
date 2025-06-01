import { ref, computed } from 'vue'
import { setWithExpiry, getWithExpiry } from '@/utils/storage'

const SESSION_TTL = 1000 * 60 * 60 * 24 // 24時間

export function useSessionStore() {
    const SESSION_KEY = 'userSession'

    const data = ref(getWithExpiry(SESSION_KEY) || null)
    const isLoading = ref(false)
    const error = ref(null)

    const isSessionValid = computed(() => !!data.value)

    const userId = computed(() => data.value?.userId || null)
    const sessionId = computed(() => data.value?.sessionId || null)

    const login = (sessionId, userId) => {
        const sessionData = { sessionId, userId }
        data.value = sessionData
        setWithExpiry(SESSION_KEY, sessionData, SESSION_TTL)
    }

    const logout = () => {
        data.value = null
        setWithExpiry(SESSION_KEY, null, 0)
    }

    const restoreSession = () => {
        const stored = getWithExpiry(SESSION_KEY)
        data.value = stored || null
    }

    return {
        data,
        isLoading,
        error,
        isSessionValid,
        userId,
        sessionId,
        login,
        logout,
        restoreSession,
    }
}
