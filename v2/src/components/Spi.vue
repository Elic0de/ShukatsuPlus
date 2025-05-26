<script setup>
	import { ref } from "vue";
	import SpiZero from "./SpiZero.vue";
	import SpiInner from "./SpiInner.vue";

	const waitForContinue = ref(true);
	const onContinue = () => {
		waitForContinue.value = false;
	};
</script>

<template>
	<SpiZero v-if="waitForContinue" @continue="onContinue"></SpiZero>
	<SpiInner v-else></SpiInner>
</template>

<style scoped></style>
