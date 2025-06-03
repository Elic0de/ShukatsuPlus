<template>
	<div class="relative mr-3 ml-3 size-[48px]">
		<div v-if="!src"
			class="inline-flex size-[48px] items-center justify-center rounded-full border-2 border-dashed border-neutral-300 align-middle text-neutral-300"
		>
		</div>
		<div v-else class="border-2 rounded-full bg-white border-neutral-200">
			<img src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcjL_YeC7sQmBJLMsxje6N_itpSGTHSbu0jszUVkIe3qR2gzzof4w08-ljFHPb04MlXQPeYmsUF_fkgO5990ixg6xZbc0tUGaDZ6zYL5fcTXczeoyWj4-RzZVUW-yI_86qMKHVO6yNnOb1KKeQ6f-FPg3EJaaILkKXnm7dl72zugS1GBRcY4djKgwgVRQg/s886/animalhealth_niwatori_byouki.png'>
		</div>
	</div>
</template>

<script setup>
	defineProps({ src: String });
</script>
