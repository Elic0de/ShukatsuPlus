import { gasApi } from "./gasApi";
import { mockApi } from "./mockApi";

// .env から VITE_USE_MOCK_API を取得（Vite では VITE_ で始まる変数だけが使える）
const isDebug = import.meta.env.VITE_USE_MOCK_API === "true";

// VITE_USE_MOCK_API=true なら mockApi を使う
export const api = isDebug  ? mockApi : gasApi;
