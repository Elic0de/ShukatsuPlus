<template>
	<div
		class="relative h-56 w-full overflow-hidden rounded-2xl bg-blue-100"
		style="--avatars-background-color: rgb(var(--color-iguana))"
	>
		<div
			class="absolute top-[39px] left-1/2 -translate-x-1/2 h-[266px]"
			role="button"
		></div>
		<img class="_3oy7c" :src="'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcjL_YeC7sQmBJLMsxje6N_itpSGTHSbu0jszUVkIe3qR2gzzof4w08-ljFHPb04MlXQPeYmsUF_fkgO5990ixg6xZbc0tUGaDZ6zYL5fcTXczeoyWj4-RzZVUW-yI_86qMKHVO6yNnOb1KKeQ6f-FPg3EJaaILkKXnm7dl72zugS1GBRcY4djKgwgVRQg/s886/animalhealth_niwatori_byouki.png'" />
	</div>
</template>

<script setup>
	defineProps({
		avatarUrl: String,
	});
</script>
