<template>
	<div
		class="flex justify-between border-b-2 border-neutral-200 p-4 text-xl font-bold text-neutral-400"
	>
		<img
			class="_2Flrl"
			src="https://d35aaqx5ub95lt.cloudfront.net/images/103c3f969d4037b39a2771330f5a3bd8.svg"
			style="visibility: hidden"
		/>
		{{ title }}
		<a :href="settingsLink">
			<img
				class="_2Flrl"
				src="https://d35aaqx5ub95lt.cloudfront.net/images/103c3f969d4037b39a2771330f5a3bd8.svg"
			/>
		</a>
	</div>
</template>

<script setup>
	defineProps({
		title: String,
		settingsLink: String,
	});
</script>
