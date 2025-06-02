const GAS_SPI_BASE_URL = import.meta.env.GAS_SPI_BASE_URL;
const GAS_MENSETSU_BASE_URL = import.meta.env.GAS_MENSETSU_BASE_URL;

export const gasApi = {
	async getUserInfo() {
		const res = await fetch(`${GAS_SPI_BASE_URL}?action=getUserInfo`);
		if (!res.ok) throw new Error("ユーザー情報取得失敗");
		return res.json();
	},

	async updateUserName(newName) {
		const res = await fetch(`${GAS_SPI_BASE_URL}?action=updateUserName`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: newName }),
		});
		if (!res.ok) throw new Error("ユーザー名更新失敗");
		return res.json();
	},

	async postIdTokenToGAS(idToken) {
		const res = await fetch(
			`${GAS_MENSETSU_BASE_URL}?path=/api/0.1/oauth/line`,
			{
				method: "POST",
				headers: { "Content-Type": "text/plain" },
				body: JSON.stringify({ idToken }),
			}
		);
		if (!res.ok) throw new Error("認証エラー");
		return res.json();
	},
};
