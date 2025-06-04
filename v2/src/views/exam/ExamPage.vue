<template>
	<LoadingV2 v-if="isLoading"/>
	<ExamView
		v-else-if="store.questions && store.questions.length > 0"
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
	import { onMounted, ref } from "vue";
	import { useRoute } from "vue-router";
	import { useExamStore } from "@/stores/exam";
	import ExamView from "@/components/exam/ExamView.vue";
	import LoadingV2 from "@/components/ui/LoadingV2.vue"

	const store = useExamStore();
	const route = useRoute();
	const sessionId = route.params.sessionId;

	const isLoading = ref(true);

	// Start exam and fetch details on component mount
	onMounted(async () => {
		await store.getQuestions(sessionId);
		isLoading.value = false;
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
