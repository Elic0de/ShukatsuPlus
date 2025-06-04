// stores/oauthStore.ts
import { defineStore } from "pinia";
import liff from '@line/liff'

export const useOAuthStore = defineStore("oauth", {
    state: () => ({
        idToken: null,
        accessToken: null,
        userId: null,
        expiresAt: null,
        sessionToken: null,
        isAuthenticated: false,
        userProfile: null // お試し程度
    }),
    actions: {
        setOAuthData(data) {
            Object.assign(this, data);
            this.isAuthenticated = !!data.sessionToken;
        },
        
        clearOAuthData() {
            this.idToken = null;
            this.accessToken = null;
            this.userId = null;
            this.expiresAt = null;
            this.sessionToken = null;
            this.isAuthenticated = false;
        },

        async loginIfNeeded() {
            if (!liff.isLoggedIn()) {
                liff.login()
                return
            }

            this.idToken = liff.getIDToken()
            this.userProfile = await liff.getProfile()
        },

        logout() {
            liff.logout()
            window.location.reload()
        }
    },
});
