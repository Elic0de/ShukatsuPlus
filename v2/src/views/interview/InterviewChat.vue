<template>
	<div class="min-h-screen bg-neutral-100 p-4 flex flex-col gap-4">
		<!-- タイトル -->
		<!-- <h1 class="text-center text-xl font-bold text-neutral-800">ロールプレイのフィードバックを見てみよう</h1> -->

		<!-- サマリー -->
		<!-- <InterviewSummary :summaryText="summary" /> -->

		<!-- チャット表示 -->
		<div class="flex flex-col gap-3">
			<template v-for="(msg, index) in messages" :key="index">
				<ChatBubble
					:sender="msg.sender === 'user' ? '' : 'Gemini'"
					:message="msg.content"
					:isUser="msg.sender === 'user'"
				>
					<FeedbackBubble
						v-if="msg.feedback"
						:suggestion="msg.feedback.suggestion"
					/>
				</ChatBubble>
			</template>
		</div>

		<!-- 入力欄 -->
		<div class="mt-auto pt-4">
			<input
				v-model="input"
				@keyup.enter="submit"
				class="w-full p-4 border-neutral-400 border-2 rounded"
				placeholder="面接官の質問に答えてください"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useInterviewStore } from "@/stores/interviewStore";
	import ChatBubble from "@/components/feedback/ChatBubble.vue";
	import FeedbackBubble from "@/components/feedback/FeedbackBubble.vue";
	import InterviewSummary from "@/components/feedback/InterviewSummary.vue";

	const store = useInterviewStore();
	const input = ref("");

	const submit = async () => {
		if (!input.value.trim()) return;

		const userText = input.value.trim();
		store.addMessage({ sender: "user", content: userText });
		input.value = "";

		// フィードバック生成（Mock / API）
		//   const feedback = await generateFeedback(userText)

		store.addMessage({
			sender: "gemini",
			content: "Thanks for your answer! Here’s some feedback:",
			// feedback: "てすとてすと",
		});

		// サマリー更新（Mock）
		// store.setSummary('全体的に丁寧ですが、具体性が足りません。強みや志望理由を明確にしましょう。')
	};

	const messages = store.messages;
	const summary = store.summary;
</script>
