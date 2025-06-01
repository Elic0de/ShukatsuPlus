<script setup>
	const props = defineProps({
		show: { type: Boolean, required: false, default: true },
		size: { type: Number, required: false, default: 16 },
	});
</script>

<template>
	<img
		v-if="props.show"
		src="../assets/loader.gif"
		alt=""
		aria-hidden="true"
		:width="props.size"
		:height="props.size"
	/>
</template>
