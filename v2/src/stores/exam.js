import { defineStore } from "pinia";
import { ref, useId } from "vue";
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
    const history = ref({});

	const startExam = async (examId, userId) => {
        reset();
		try {
			const session = await api.startExam(examId, userId);
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

	const getReview = async (attempt_id) => {
		try {
			const rev = await api.getReview(attempt_id);
			review.value = rev;
			return rev;
		} catch (error) {
			store.error.value = error.message || "解説の取得に失敗しました";
		}
	};

    const getExamHistory = async (sessionId) => {
		try {
			const rev = await api.getExamHistory(sessionId);
			history.value = rev;
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

    const reset = () => {
        resetLocalTimer();
        answers.value = null;
        result.value = null;
        questions.value = null;
        review.value = null;
        totalTime.value = null;
        localTimeLeft.value = null;
        currentIndex.value = null;
    }

	return {
		...store,
		answers,
		result,
		questions,
		review,
		totalTime,
		localTimeLeft,
		currentIndex,
        history,
        getExamHistory,
		startExam,
		submitAnswer,
		getQuestions,
		getReview,
		selectAnswer,
		resetLocalTimer,
		nextQuestion,
	};
});
