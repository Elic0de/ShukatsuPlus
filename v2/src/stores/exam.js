import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "@/apis/apiFactory";
import { createCachedStore } from "./factories/useCachedStoreFactory";

export const useExamStore = defineStore("exam", () => {
	const store = createCachedStore("exam", api.fetchAvailableExams);

	const answers = ref({});
	const result = ref(null);
	const questions = ref([]);
	const review = ref([]);
	const totalTime = ref(60 * 35);
	const localTimeLeft = ref(30);
	const currentIndex = ref(0);

	const startExam = async (examId) => {
		try {
			const session = await api.startExam(examId);
			return session.session_id;
		} catch (error) {
			store.error.value = error.message || "試験の開始に失敗しました";
		}
	};

	const getQuestions = async (sessionId) => {
		try {
			const q = await api.getQuestions(sessionId);
			questions.value = q;
			return q;
		} catch (error) {
			store.error.value = error.message || "問題の取得に失敗しました";
		}
	};

	const submitAnswer = async (sessionId, answer) => {
		try {
			const res = await api.submitAnswer(sessionId, answer);
			result.value = res; // ✅ 結果を保存
			return res;
		} catch (error) {
			store.error.value = error.message || "回答の送信に失敗しました";
		}
	};

	const getReview = async (sessionId) => {
		try {
			const rev = await api.getReview(sessionId);
			review.value = rev;
			return rev;
		} catch (error) {
			store.error.value = error.message || "解説の取得に失敗しました";
		}
	};

	const selectAnswer = (partId, optionKey) => {
		answers.value[partId] = optionKey;
	};

	const resetLocalTimer = (seconds = 60) => {
		localTimeLeft.value = seconds;
	};

	const nextQuestion = () => {
		currentIndex.value++;
		resetLocalTimer();
	};

	return {
		...store,
		answers,
		result,
		questions,
		review,
		totalTime,
		localTimeLeft,
		currentIndex,
		startExam,
		submitAnswer,
		getQuestions,
		getReview,
		selectAnswer,
		resetLocalTimer,
		nextQuestion,
	};
});
