<template>
	<Loading v-if="loading" />
	<div v-else>
		<div
			class="px-6 py-4 font-sans text-[17px] leading-[20px] font-medium text-neutral-600"
		>
			<StickyBar />
			<div class="pb-52" v-if="currentPart">
				<h2 class="mb-2 border-b-2 py-2 text-2xl font-bold">
					{{ currentQuestion.title }}
				</h2>

				<ReviewHeader :questionCount="currentQuestion.parts.length" />

				<ReviewContent
					:part="currentPart"
					:correctAnswer="currentPart.correctAnswer"
					:userAnswer="currentPart[currentPart.id]"
					:explanation="currentPart.explanation"
				/>
			</div>
		</div>

		<ReviewNavigation
			:question="currentQuestion"
			:selectedPartIndex="selectedPartIndex"
			@selectPart="selectedPartIndex = $event"
			@next="handleNext"
			@prev="handlePrev"
		/>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useRoute } from "vue-router";
	import { useExamStore } from "@/stores/exam";
	import ReviewHeader from "@/components/exam/review/ReviewHeader.vue";
	import ReviewContent from "@/components/exam/review/ReviewContent.vue";
	import ReviewNavigation from "@/components/exam/review/ReviewNavigation.vue";
	import StickyBar from "@/components/ui/StickyBar.vue";

	import Loading from "@/components/ui/LoadingV2.vue";

	const route = useRoute();
	const store = useExamStore();
	const loading = ref(true);
	const currentIndex = ref(0);
	const selectedPartIndex = ref(0);

	const questions = computed(() => store.review);
	const result = computed(() => store.result);

	const currentQuestion = computed(() => questions.value[currentIndex.value]);
	const currentPart = computed(
		() => currentQuestion.value?.parts[selectedPartIndex.value]
	);

	onMounted(async () => {
		const sessionId = route.params.sessionId;
		await store.getReview(sessionId);
		loading.value = false;
	});

	function handleNext() {
		const isLastQuestion = currentIndex.value >= questions.value.length - 1;

		if (!isLastQuestion) {
			currentIndex.value++;
			selectedPartIndex.value = 0;
		}
	}

	function handlePrev() {
		if (currentIndex.value > 0) {
			currentIndex.value--;
		}
	}
</script>
