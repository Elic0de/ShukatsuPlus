<template>
	<ExamView
		v-if="store.questions && store.questions.length > 0"
		:currentQuestionIndex="store.currentIndex"
		:questions="store.questions"
		:answers="store.answers"
		:result="store.result"
		:localTimeLeft="store.localTimeLeft"
		:totalTime="store.totalTime"
		@select="store.selectAnswer"
		@next="handleNext"
	/>
</template>

<script setup>
	import { onMounted } from "vue";
	import { useRoute } from "vue-router";
	import { useExamStore } from "@/stores/exam";
	import ExamView from "@/components/exam/ExamView.vue";

	const store = useExamStore();
	const route = useRoute();
	const sessionId = route.params.sessionId;

	// Start exam and fetch details on component mount
	onMounted(async () => {
		await store.getQuestions(sessionId);
	});

	const handleNext = async () => {
		const isLastQuestion = store.currentIndex >= store.questions.length - 1;

		if (isLastQuestion) {
			await store.submitAnswer(sessionId, store.answers);
		} else {
			store.nextQuestion();
		}
	};
</script>
