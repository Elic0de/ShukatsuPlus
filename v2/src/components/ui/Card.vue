<template>
	<button
		class="border-2 border-neutral-200 rounded-2xl w-full mb-2 text-left p-0 shadow-xs overflow-hidden"
	>
		<div class="flex flex-row min-h-15 pl-4">
			<div class="flex flex-col justify-center mt-2 mr-auto mb-4">
				<div class="text-xl font-bold mb-1">{{ title }}</div>
				<div v-if="date" class="text-sm text-neutral-500">
					受験した日付: {{ date }}
				</div>
			</div>
		</div>
	</button>
</template>

<script setup>
	defineProps({
		title: String,
		subtitle: String,
		image: String,
		date: String,
	});
</script>
