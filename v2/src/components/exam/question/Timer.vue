<template>
	<div class="timer font-bold">
		{{ label }}:<span class="font-normal">{{ formattedTime }}</span>
	</div>
</template>

<script setup>
	import { computed } from "vue";
	const props = defineProps({
		seconds: {
			type: Number,
			required: true,
		},
		label: {
			type: String,
			default: "タイマー",
		},
	});
	const formattedTime = computed(() => {
		const m = String(Math.floor(props.seconds / 60)).padStart(2, "0");
		const s = String(props.seconds % 60).padStart(2, "0");
		return `${m}:${s}`;
	});
</script>
