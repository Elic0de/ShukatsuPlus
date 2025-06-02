<script setup>
	import RankBadge from "@/components/leaderboard/RankBadge.vue";
	import UserAvatar from "@/components/leaderboard/UserAvatar.vue";
	defineProps({
		rank: Number,
		username: String,
		score: Number,
		highlight: Boolean,
	});
</script>

<template>
	<div class="flex items-center px-6 py-2">
		<!-- ランクが1〜3の場合はアイコン、それ以外はRankBadge -->
		<div class="w-[42px]">
			<img
				v-if="rank === 1"
				src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/9e4f18c0bc42c7508d5fa5b18346af11.svg"
				alt="Gold"
				class="w-[42px] h-[42px]"
			/>
			<img
				v-else-if="rank === 2"
				src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/cc7b8f8582e9cfb88408ab851ec2e9bd.svg"
				alt="Silver"
				class="w-[42px] h-[42px]"
			/>
			<img
				v-else-if="rank === 3"
				src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/eef523c872b71178ef5acb2442d453a2.svg"
				alt="Bronze"
				class="w-[42px] h-[42px]"
			/>
			<RankBadge v-else :rank="rank" />
		</div>

		<!-- アバター（仮表示） -->
		<UserAvatar class="ml-3 mr-7" />
		<!-- <div class="relative mr-7 ml-3 size-[48px]">
        <div class="inline-flex size-[48px] items-center justify-center rounded-full border-2 border-dashed border-neutral-300 align-middle text-neutral-300">O</div>
    </div> -->

		<!-- 名前・スコア -->
		<div
			class="mr-2.5 flex grow flex-col items-start overflow-hidden text-left"
		>
			<span
				class="w-full font-bold overflow-ellipsis whitespace-nowrap"
				>{{ username }}</span
			>
		</div>
		<span class="mr-2.5 text-right text-neutral-500"
			>{{ score }} score</span
		>
	</div>
</template>
