<script setup>
	import { ref, onMounted } from "vue";
	import LeaderboardItem from "@/components/leaderboard/LeaderboardItem.vue";
	import LeaderboardSkeleton from "@/components/leaderboard/LeaderboardSkeleton.vue";

	import { useLeaderboardStore } from "@/stores/leaderboard";

	const leaderboardStore = useLeaderboardStore();

	onMounted(() => {
		leaderboardStore.loadLeaderboard();
	});
</script>

<template>
	<div class="m-0 flex w-full flex-col pb-20 text-center">
		<!-- ヘッダー -->
		<div class="sticky z-10 bg-white">
			<div class="mt-6 mb-5 text-[25px] font-bold">リーダーボード</div>
			<div class="mb-4 h-6.5 items-center">
				<hr class="h-0 border-0 border-t-2 border-neutral-200" />
			</div>
		</div>

		<!-- 本体 -->
		<div class="flex flex-col">
			<!-- ローディング中 -->
			<LeaderboardSkeleton v-if="leaderboardStore.isLoading" :count="5" />

			<!-- リスト表示 -->
			<LeaderboardItem
				v-else
				v-for="(item, index) in leaderboardStore.leaderboard"
				:key="item.id"
				:rank="index + 1"
				:username="item.username"
				:score="item.score"
				:highlight="item.id === 1"
			/>
		</div>
	</div>
</template>
