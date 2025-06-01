<template>
	<div class="flex flex-col pb-4">
		<div class="border-n text-xl font-bold text-neutral-500">
			<span>この問題は{{ questionCount }}問組です。</span>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		questionCount: Number,
	});
</script>
