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
}
