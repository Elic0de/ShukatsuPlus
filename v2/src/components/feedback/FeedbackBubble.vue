<template>
	<div class="flex flex-col sm:flex-row gap-2 mt-3">
		<div class="flex-1 rounded-md border border-green-200 bg-green-50 p-3">
			<div class="mb-1 text-xs font-semibold text-green-700">
				提案された改善
			</div>
			<div class="text-sm text-neutral-800">
				<span class="text-green-700 italic">{{ suggestion }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		suggestion: { type: String, required: true },
	});
</script>
