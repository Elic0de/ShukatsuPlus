const VITE_GAS_SPI_BASE_URL = import.meta.env.VITE_GAS_SPI_BASE_URL;
const VITE_GAS_MENSETSU_BASE_URL = import.meta.env.VITE_GAS_MENSETSU_BASE_URL;

export const gasApi = {
    async getUserInfo() {
        const res = await fetch(`${VITE_GAS_SPI_BASE_URL}?action=getUserInfo`);
        if (!res.ok) throw new Error("ユーザー情報取得失敗");
        return res.json();
    },

    async updateUserName(newName) {
        const res = await fetch(`${VITE_GAS_SPI_BASE_URL}?action=updateUserName`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });
        if (!res.ok) throw new Error("ユーザー名更新失敗");
        return res.json();
    },

    async postIdTokenToGAS(idToken) {
        try {
            const res = await fetch(`${VITE_GAS_MENSETSU_BASE_URL}?path=/api/0.1/oauth/line`, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ idToken }),
            });
            return await res.json();
        } catch (e) {
            console.error("GAS通信失敗:", e);
            return {
                success: false,
                reason: "network",
                message: "ネットワークエラーが発生しました",
            };
        }
    },

    async fetchAvailableExams() {
        const res = await fetch(`${VITE_GAS_SPI_BASE_URL}?action=getExams`);

        if (!res.ok) throw new Error("試験情報取得失敗");

    async startExam(examId, userId) {
        const res = await fetch(`${VITE_GAS_SPI_BASE_URL}?action=startExam&user_id=${userId}&exam_id=${examId}`);
        if (!res.ok) throw new Error("試験開始失敗");

        return res.json();
    }
};
