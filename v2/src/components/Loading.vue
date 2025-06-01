<template>
	<div
		class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-212"
	>
		<div class="flex space-x-4">
			<span
				class="size-2 bg-neutral-700 rounded-full animate-ping animation-delay-0"
			></span>
			<span
				class="size-2 bg-neutral-700 rounded-full animate-ping animation-delay-200"
			></span>
			<span
				class="size-2 bg-neutral-700 rounded-full animate-ping animation-delay-400"
			></span>
		</div>
	</div>
</template>

<style scoped>
	/* Tailwind CSS doesn't support animation-delay utilities directly yet */
	.animation-delay-0 {
		animation-delay: 0ms;
	}
	.animation-delay-200 {
		animation-delay: 200ms;
	}
	.animation-delay-400 {
		animation-delay: 400ms;
	}
</style>
