export const mockApi = {
    getUserInfo() {
        return Promise.resolve({
            name: 'テストユーザー',
            id: 'mock123',
            email: 'test@example.com',
        })
    },

    updateUserName(newName) {
        console.log('Mock: updateUserName called with', newName)
        return Promise.resolve({ success: true })
    },

    fetchLeaderboard() {
        return Promise.resolve([
            { id: 1, username: 'ひいろ', score: 2500 },
            { id: 2, username: 'えい', score: 2400 },
            { id: 3, username: 'りく', score: 2300 },
            { id: 4, username: 'もっち', score: 2200 },
            { id: 5, username: 'かな', score: 2100 },
        ])
    },

    fetchAvailableExams() {
        return Promise.resolve([
            { id: 'exam1', title: '数学の基礎', description: '数学の基礎を学ぶための試験' },
            { id: 'exam2', title: '物理の基礎', description: '物理の基礎を学ぶための試験' },
        ])
    },
}
