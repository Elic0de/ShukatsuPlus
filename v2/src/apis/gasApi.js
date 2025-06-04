import { createApiClient } from "@/composables/apiClient";

const GAS_SPI = import.meta.env.VITE_GAS_SPI_BASE_URL;
const GAS_MENSETSU = import.meta.env.VITE_GAS_MENSETSU_BASE_URL;

const spiApi = createApiClient(GAS_SPI);
const mensetsuApi = createApiClient(GAS_MENSETSU);

export const gasApi = {
  // SPI関連
  async getUserInfo() {
    return spiApi("?action=getUser");
  },

  async updateUserStatus(userData) {
    return spiApi("?action=updateUserStatus", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  async fetchAvailableExams() {
    return spiApi("?action=getExams");
  },

  async startExam(examId, userId) {
    return spiApi(`?action=startExam&user_id=${userId}&exam_id=${examId}`);
  },

  async getQuestions(sessionId) {
    return spiApi(`?action=getExamDetail&attempt_id=${sessionId}`);
  },

  async submitAnswer(sessionId, answers) {
    return spiApi(`?action=submitAnswer&attempt_id=${sessionId}`, {
      method: "POST",
      body: JSON.stringify({ session_id: sessionId, answers }),
    });
  },

  async getExamHistory(sessionId) {
    return spiApi(`?action=getResult&session_id=${sessionId}`);
  },

  async getReview(attemptId) {
    return spiApi(`?action=getExamReviewDetail&attempt_id=${attemptId}`);
  },

  // 面接関連
  async postIdTokenToGAS(idToken) {
    return mensetsuApi("?path=/api/0.1/oauth/line", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },

  async fetchLeaderboard() {
    return spiApi(`?action=leaderboard`);
  },
};
