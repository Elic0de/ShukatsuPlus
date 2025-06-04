// composables/useApiClient.ts
import { useSessionStore } from "@/stores/session";

export const createApiClient = (baseUrl) => {
  return async function apiRequest(
    endpoint,
    options = {}
  ) {
    const sessionStore = useSessionStore();

    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "text/plain");

    // session_idを追加する処理
    if (sessionStore.sessionId.value) {
      const url = new URL(endpoint, "http://dummy.base"); // baseは絶対URLじゃないとエラーになるためダミーを指定
      url.searchParams.delete("session_id");
      url.searchParams.append("session_id", sessionStore.sessionId.value);

      endpoint = url.search + url.hash;
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`APIエラー: ${res.status} ${message}`);
    }

    return res.json();
  };
};
