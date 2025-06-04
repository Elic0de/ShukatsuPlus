// composables/useAuth.ts
import { useSessionStore } from "@/stores/session";
import { useUserStore } from "@/stores/user";
import { useLiff } from "./useLiff";
import { api } from "@/apis/apiFactory";

export const useAuth = () => {
	const sessionStore = useSessionStore();
	const userStore = useUserStore();
	const { login: liffLogin, getIdToken, isReady } = useLiff();

	const authenticateWithLiff = async () => {
		try {
			await liffLogin(); // 未ログインならLIFFログイン
			const idToken = getIdToken();
			if (!idToken) throw new Error("IDトークンが取得できませんでした");

			const response = await api.postIdTokenToGAS(idToken);

			if (!response.success) {
				handleAuthError(response);
				throw new Error(response.message || "認証に失敗しました");
			}

			saveSession(response);
		} catch (error) {
			console.error("LIFF認証エラー:", error);
			throw error; // 呼び出し元に通知（UI側でエラー表示）
		}
	};

	const saveSession = (response) => {
		sessionStore.login(response.session_id, response.user_id);
		userStore.updateUser({
			id: response.user_id,
			name: response.username,
		});
	};

	const handleAuthError = (response) => {
		if (response.reason === "expired") {
			console.warn("IDトークン期限切れ。再ログインします。");
			liffLogin(); // 再ログイン促す（遷移は呼び出し元に任せる）
		} else {
			alert(response.message || "ログインに失敗しました");
		}
	};

	return {
		isReady,
		authenticateWithLiff,
	};
};
