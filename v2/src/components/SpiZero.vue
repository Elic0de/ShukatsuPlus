<script setup>
	import { ref } from "vue";
	import Header from "./Header.vue";

	defineEmits(["continue"]);
</script>

<template>
	<Header text="SPI"></Header>
	<p>SPI機能を利用するにはLINEでログインする必要があります。</p>
	<button @click="$emit('continue')" class="btn line">LINEでログインする</button>
	<details>
		<div v-for="_ in 'hfieuhfiuwehfiuewhui'">
		<div v-for="_ in 'hfieuhfiuwehfiuewhui'">
			<hr />
		</div>
		</div>
	</details>
</template>

<style scoped>
	.line {
		filter: hue-rotate(-50deg);
		margin-left: auto;
		display: block;
	}
</style>
