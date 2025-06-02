<template>
	<div
		class="rounded-2xl flex min-h-75 overflow-hidden bg-gradient-to-b from-teal-900 via-indigo-900 to-purple-900"
	>
		<div class="p-6 flex flex-col overflow-hidden mr-auto">
			<h4 class="text-white text-2xl font-bold mb-2.5">面接練習</h4>
			<p class="text-white text-base mb-6">
				AIを使って弱点を克服しよう！
			</p>
			<button
				class="mt-auto font-bold outline-none rounded-xl text-indigo-500 h-10.5 bg-white px-4 border-b-4 border-purple-300 text-[15px] justify-center items-center inline-flex relative cursor-pointer"
				@click="$emit('click')"
			>
				<span class="_9lHjd">開始</span>
			</button>
		</div>
		<img
			class="mt-auto size-40"
			draggable="false"
			src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjw7WTGS1ktZs4F-_LQBFXTs0ND1oGPD7czLVPJnSsI80MMcjFAvl9DHPaa3mo8j4CyJuC4r88DhTLAMU-yN2eoqARKRIDh9y-4BvdCT3L1iJ5vnC4TsRhxefbFR_N5ddVOOUoCkBkixAA/s400/mensetsu_mensetsukan.png"
		/>
	</div>
</template>
