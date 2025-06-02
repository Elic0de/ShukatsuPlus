<!-- components/RankBadge.vue -->
<script setup>
	defineProps({
		rank: {
			type: Number,
			required: true,
		},
	});
</script>

<template>
	<div
		class="flex h-[42px] w-[42px] items-center justify-center bg-white text-lg font-bold text-gray-600"
	>
		{{ rank }}
	</div>
</template>
