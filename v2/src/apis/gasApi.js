const GAS_BASE_URL = import.meta.env.SPI_API_BASE_URL

export const gasApi = {
  async getUserInfo() {
    const res = await fetch(`${GAS_BASE_URL}?action=getUserInfo`)
    if (!res.ok) throw new Error('ユーザー情報取得失敗')
    return res.json()
  },

  async updateUserName(newName) {
    const res = await fetch(`${GAS_BASE_URL}?action=updateUserName`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
    if (!res.ok) throw new Error('ユーザー名更新失敗')
    return res.json()
  },
}
