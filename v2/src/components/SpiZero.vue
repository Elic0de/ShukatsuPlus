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
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			<img src="/favicon.ico" alt="vue.js">
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
