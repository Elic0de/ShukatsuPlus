<template>
	<div>
		<!-- <HeaderBar /> -->
		<ExamListSkeleton v-if="examStore.isLoading" />
		<div v-else class="m-0 flex w-full flex-col pb-20 text-center">
			<div class="sticky z-10 bg-white">
				<div class="mt-6 mb-5 text-[25px] font-bold">SPI模擬試験</div>
				<div class="h-6.5 items-center">
					<hr class="h-0 border-0 border-t-2 border-neutral-200" />
				</div>
			</div>

			<main class="">
				<section class="m-6 pb-25">
					<section class="mt-6">
						<h3
							class="mb-4 text-2xl font-bold text-neutral-700 text-left"
						>
							受験可能な試験一覧
						</h3>
						<Card
							v-for="exam in examStore.data"
							:key="exam.exam_id"
							:title="exam.title"
							@click="startExam(exam.exam_id)"
						/>
					</section>
					<section class="mt-6">
						<h3
							class="mb-4 text-2xl font-bold text-neutral-700 text-left"
						>
							受験履歴
						</h3>
						<Card
							v-for="exam in examStore.data"
							:key="exam.exam_id"
							:title="exam.title"
							:date="'2025/05/31'"
							@click="
								() =>
									goToReview(
										'0cffbc57-1ce6-4a05-8de7-cbf3bca36720'
									)
							"
						/>
					</section>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { useExamStore } from "@/stores/exam";
	import Card from "@/components/ui/Card.vue";
	import ExamListSkeleton from "@/components/exam/ExamListSkeleton.vue";

	const router = useRouter();
	const examStore = useExamStore();

	onMounted(() => {
		examStore.load();
	});

	async function startExam(examId) {
		const session_id = await examStore.startExam(examId);
		if (!session_id) return;
		router.push(`/spi/${session_id}`);
	}

	const goToReview = (examId) => {
		router.push(`/spi/review/${examId}`);
	};
</script>
