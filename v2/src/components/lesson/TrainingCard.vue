<template>
	<button
		class="border-2 border-neutral-200 rounded-2xl w-full mb-8 text-left p-0 shadow-xs overflow-hidden"
		@click="$emit('click')"
	>
		<div class="flex flex-row min-h-27.5 pl-4">
			<div class="flex flex-col justify-center mt-4 mr-auto mb-4">
				<div class="text-xl font-bold mb-2">{{ title }}</div>
				<div class="text-base text-neutral-500 font-medium">
					{{ subtitle }}
				</div>
			</div>
			<img class="size-32" :src="image" />
		</div>
	</button>
</template>

<script setup>
	defineProps({
		title: String,
		subtitle: String,
		image: String,
	});
</script>
