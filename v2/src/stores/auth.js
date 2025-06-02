// stores/oauthStore.ts
import { defineStore } from "pinia";

export const useOAuthStore = defineStore("oauth", {
	state: () => ({
		idToken: null,
		accessToken: null,
		userId: null,
		expiresAt: null,
		sessionToken: null,
		isAuthenticated: false,
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
	},
});
