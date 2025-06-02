import { gasApi } from "./gasApi";
import { mockApi } from "./mockApi";

// .env から VITE_DEBUG を取得（Vite では VITE_ で始まる変数だけが使える）
const isDebug = import.meta.env.VITE_USE_MOCK_API === "true";

// GAS環境かどうかも一応確認（ブラウザでGAS以外を使っていても大丈夫なように）
const isGasEnv = typeof google !== "undefined" && google.script?.run;

// VITE_DEBUG=true なら mockApi を使う
export const api = isDebug || !isGasEnv ? mockApi : gasApi;
