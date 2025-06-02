<template>
	<div class="m-0 flex w-full flex-col pb-20.5 text-center animate-pulse">
		<!-- 1位〜8位のスケルトン -->
		<div
			v-for="i in 8"
			:key="i"
			class="relative m-0 flex flex-1 flex-col overflow-hidden pb-1"
		>
			<div class="flex items-center px-6 py-2">
				<!-- ランク or アイコン -->
				<div class="w-[41px] h-4 bg-gray-300 rounded"></div>

				<!-- ユーザーアイコン -->
				<div class="relative mr-7 ml-3 size-[48px]">
					<div
						class="inline-flex size-[48px] items-center justify-center rounded-full border-2 border-dashed border-neutral-300 bg-gray-200"
					></div>
				</div>

				<!-- 名前 -->
				<div
					class="mr-2.5 flex grow flex-col items-start overflow-hidden text-left"
				>
					<div class="h-4 bg-gray-300 rounded w-24"></div>
				</div>

				<!-- スコア -->
				<div class="h-4 bg-gray-300 rounded w-16 mr-2.5"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		count: {
			type: Number,
			default: 5, // 表示するスケルトン数
		},
	});
</script>
