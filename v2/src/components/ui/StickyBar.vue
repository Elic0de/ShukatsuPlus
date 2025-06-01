<template>
	<div
		class="sticky top-0 z-40 flex items-center justify-between bg-white py-2"
	>
		<!-- 閉じるボタン -->
		<button
			@click="goBack"
			class="h-6 w-6 text-neutral-500 hover:text-red-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<!-- progress bar（時間経過バー） -->
		<!-- <div class="mx-4 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div class="h-full bg-indigo-500 transition-all duration-300 ease-in-out" style="width: 30%;"></div>
        </div> -->
	</div>
</template>

<script setup>
	import { useRouter } from "vue-router";

	const router = useRouter();

	const goBack = () => {
		if (window.history.length > 1) {
			router.go(-1);
		} else {
			router.push("/");
		}
	};
</script>
