<template>
	<div
		class="relative h-56 w-full overflow-hidden rounded-2xl bg-blue-100"
		style="--avatars-background-color: rgb(var(--color-iguana))"
	>
		<div
			class="absolute top-[39px] left-1/2 -translate-x-1/2 h-[266px]"
			role="button"
		></div>
		<img class="_3oy7c" :src="avatarUrl" />
	</div>
</template>

<script setup>
	defineProps({
		avatarUrl: String,
	});
</script>
