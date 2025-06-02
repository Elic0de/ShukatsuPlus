<template>
	<div
		class="h-full left-0 fixed top-0 w-full items-center bg-white flex justify-center"
	>
		<div class="items-center flex flex-col p-4">
			<div class="inline-block h-[177px] mb-6 w-[150px]">
				<img
					src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgb4Nz2RvY2RVfU_qpqL8fqQGGgKC3wNwDCADd0qTfhE-24UGyfdaIia-XsArjnr8HlvIL1fzVDwxYI7l26IluluPOC6IJ67kZ5PJmh77n1PjQsz2CLPj4zv0ZSLpuw01mJZSQ1Lmm4Zile/s800/computer_bar5_load.png"
					alt=""
				/>
			</div>
			<span class="font-bold text-[17px] leading-[25px] text-neutral-500"
				>ロード中...</span
			>
			<span
				class="font-medium text-[17px] leading-[25px] text-neutral-600 mt-3 align-middle"
			>
				{{ randomTip }}
			</span>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";

	const tips = [
		"説明会の質問コーナー、だいたい“福利厚生”から始まる説。",
		"“自分らしさ”って案外、他人に聞いた方が見えてくる。",
		"“御社”って噛んじゃっても大丈夫。笑顔は噛まないようにね。",
		"第一志望に落ちても、人生の第一章が終わるわけじゃない。",
		"“この会社じゃなきゃダメ”じゃなくて、“この会社でも輝ける自分”を。",
		"“自信ない”って言いながら挑戦してる時点で強い。",
		"エントリー数じゃなくて、1社1社との“向き合い方”が大事。",
		"“トイレどこですか？”って聞ける勇気、面接でも活きるよ。",
	];

	const randomTip = ref("");

	// コンポーネントがマウントされたときにランダムに1つ選ぶ
	onMounted(() => {
		const index = Math.floor(Math.random() * tips.length);
		randomTip.value = tips[index];
	});
</script>
