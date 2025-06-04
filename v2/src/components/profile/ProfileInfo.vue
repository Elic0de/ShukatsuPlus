<template>
	<div class="mt-2 flex flex-col border-b-2 border-b-neutral-200 pb-4">
		<div class="_2WSeP">
			<div class="flex flex-col">
				<h1 class="mb-1.5 text-2xl font-bold" dir="ltr">
					{{ username }}
				</h1>
				<div class="flex gap-4 items-center">
					<div class="text-neutral-400">@ {{ nickname }}</div>
					<div class="text-neutral-500 mt-1">
						<div class="_3KQMU">{{ formattedJoinedAt }}に参加</div>
					</div>
				</div>
			</div>
		</div>
		<div class="_2EQ1j">
			<div class="D0HbC"></div>
		</div>
	</div>
</template>

<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		username: String,
		nickname: String,
		joinedAt: String,
	})

	const formattedJoinedAt = computed(() => {
		const date = new Date(props.joinedAt)
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		return `${year}年${month}月`
	})
</script>
