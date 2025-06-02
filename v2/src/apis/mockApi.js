const GAS_MENSETSU_BASE_URL = import.meta.env.GAS_MENSETSU_BASE_URL
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// モックデータ
const mockExams = [
	{ id: "exam1", title: "SPI 模擬試験 A" },
	{ id: "exam2", title: "SPI 模擬試験 B" },
];

const mockQuestions = [
	{
		title: "次の問いに答えなさい。",
		category: "非言語",
		parts: [
			{
				id: 51,
				question:
					"XはYに1,500円の貸しがあり、YはZに2,000円の貸しがあり、ZはXに1,000円の貸しがある。ある日、3人で4,500円のパーティーを開き、代金はXが全額支払った。この後、3人の間で貸し借りがなくなるように精算するために次の様に支払った。YがZにc円支払い、ZがXにd円支払う。（c、dは0か正の整数とする）dはいくらか。",
				choices: {
					251: "3000円",
					252: "3250円",
					253: "3500円",
					254: "3750円",
					255: "4000円",
					256: "4250円",
					257: "4500円",
					258: "4750円",
					259: "5000円",
					260: "AからIのいずれでもない",
				},
				correctAnswer: "251",
				explanation: "1. 初期貸借の整理：XはYから1500円受け取り、Zに1000円支払うので、Xの純貸借は+500円。YはXに1500円支払い、Zから2000円受け取るので、Yの純貸借は+500円。ZはYに2000円支払い、Xから1000円受け取るので、Zの純貸借は-1000円。 2. パーティー代の精算：費用総額4500円、1人あたり1500円負担。Xが全額支払ったので、Xは4500円支払い、負担1500円なので、3000円立て替えた(+3000円)。YとZは各自1500円をXに支払う必要がある(-1500円)。 3. 総合精算額：X = +500 (初期) + 3000 (パーティー) = +3500円 (受け取る)。Y = +500 (初期) - 1500 (パーティー) = -1000円 (支払う)。Z = -1000 (初期) - 1500 (パーティー) = -2500円 (支払う)。 4. 支払いの流れ：ZがXにd円支払うことでXの精算が完了するので、Xが受け取るべき3500円がdとなる。d = 3500円。",
			},
			{
				id: 52,
				question:
					"前問の状況で、パーティーの代金4,500円をXが支払うのではなく、3人の貸し借りが帳消しになるように、この4,500円の支払いを各自が分担して店に直接支払う場合、Xはいくら支払うか。",
				choices: {
					261: "500円支払う",
					262: "750円支払う",
					263: "1000円支払う",
					264: "1250円支払う",
					265: "1500円支払う",
					266: "500円受け取る",
					267: "750円受け取る",
					268: "1000円受け取る",
					269: "1250円受け取る",
					270: "AからIのいずれでもない",
				},
				correctAnswer: "269",
				explanation: "Xは1500円の貸し借りがあり",
			},
		],
	},
	{
		title: "太字で示された二語の関係を考え、同じ関係の対になるよう（      ）に当てはまる言葉を1つ選びなさい。",
		category: "言語",
		parts: [
			{
				id: 1,
				question: "浄化：汚染　勤勉：（ ）",
				choices: {
					1: "博学",
					2: "謙虚",
					3: "傾倒",
					4: "怠惰",
					5: "多忙",
				},
				correctAnswer: "1",
				explanation: "Xは1500円の貸し借りがあり",
			},
		],
	},
	{
		title: "太字で示された二語の関係を考え、同じ関係の対になるよう（      ）に当てはまる言葉を1つ選びなさい。",
		category: "言語",
		parts: [
			{
				id: 2,
				question: "切迫：火急　堪忍：（ ）",
				choices: {
					6: "停滞",
					7: "抑制",
					8: "軽率",
					9: "制御",
					10: "勘弁",
				},
				correctAnswer: "10",
				explanation: "Xは1500円の貸し借りがあり",
			},
		],
	},
];

// セッション ID を模倣
let mockSessionIdCounter = 100;

export const mockApi = {
	getUserInfo() {
		return Promise.resolve({
			name: "テストユーザー",
			id: "mock123",
			email: "test@example.com",
		});
	},

	updateUserName(newName) {
		console.log("Mock: updateUserName called with", newName);
		return Promise.resolve({ success: true });
	},

	fetchLeaderboard() {
		return Promise.resolve([
			{ id: 1, username: "ひいろ", score: 2500 },
			{ id: 2, username: "えい", score: 2400 },
			{ id: 3, username: "りく", score: 2300 },
			{ id: 4, username: "もっち", score: 2200 },
			{ id: 5, username: "かな", score: 2100 },
		]);
	},

	fetchAvailableExams() {
		return Promise.resolve([
			{
				exam_id: 1,
				title: "SPI模試（基本）",
				subject: "math",
				time_limit: 30,
				is_public: true,
			},
			{
				exam_id: 2,
				title: "SPI模試（応用）",
				subject: "english",
				time_limit: 45,
				is_public: true,
			},
		]);
	},

	startExam() {
		return Promise.resolve({
			session_id: "0cffbc57-1ce6-4a05-8de7-cbf3bca36720",
		});
	},

	getQuestions(session_id) {
		return Promise.resolve([
			{
				title: "次の問いに答えなさい。",
				category: "非言語",
				parts: [
					{
						id: 51,
						question:
							"XはYに1,500円の貸しがあり、YはZに2,000円の貸しがあり、ZはXに1,000円の貸しがある。ある日、3人で4,500円のパーティーを開き、代金はXが全額支払った。この後、3人の間で貸し借りがなくなるように精算するために次の様に支払った。YがZにc円支払い、ZがXにd円支払う。（c、dは0か正の整数とする）dはいくらか。",
						choices: {
							251: "3000円",
							252: "3250円",
							253: "3500円",
							254: "3750円",
							255: "4000円",
							256: "4250円",
							257: "4500円",
							258: "4750円",
							259: "5000円",
							260: "AからIのいずれでもない",
						},
					},
					{
						id: 52,
						question:
							"前問の状況で、パーティーの代金4,500円をXが支払うのではなく、3人の貸し借りが帳消しになるように、この4,500円の支払いを各自が分担して店に直接支払う場合、Xはいくら支払うか。",
						choices: {
							261: "500円支払う",
							262: "750円支払う",
							263: "1000円支払う",
							264: "1250円支払う",
							265: "1500円支払う",
							266: "500円受け取る",
							267: "750円受け取る",
							268: "1000円受け取る",
							269: "1250円受け取る",
							270: "AからIのいずれでもない",
						},
					},
				],
			},
			{
				title: "太字で示された二語の関係を考え、同じ関係の対になるよう（      ）に当てはまる言葉を1つ選びなさい。",
				category: "言語",
				parts: [
					{
						id: 1,
						question: "浄化：汚染　勤勉：（ ）",
						choices: {
							1: "博学",
							2: "謙虚",
							3: "傾倒",
							4: "怠惰",
							5: "多忙",
						},
					},
				],
			},
			{
				title: "太字で示された二語の関係を考え、同じ関係の対になるよう（      ）に当てはまる言葉を1つ選びなさい。",
				category: "言語",
				parts: [
					{
						id: 2,
						question: "切迫：火急　堪忍：（ ）",
						choices: {
							6: "停滞",
							7: "抑制",
							8: "軽率",
							9: "制御",
							10: "勘弁",
						},
					},
				],
			},
		]);
	},

	submitAnswer: async (sessionId, answers) => {
		await delay();
		const total = mockQuestions.length;
		let correct = 0;
		mockQuestions.forEach((q) => {
			if (answers[q.part_id] === q.correct) correct++;
		});
		return {
			score: Math.round((correct / total) * 100),
			correct,
			total,
			duration: 30,
		};
	},

	getReview: async (sessionId) => {
		await delay();
		return mockQuestions;
	},
    postIdTokenToGAS: async (idToken) => {
        const res = await fetch(`${GAS_MENSETSU_BASE_URL}?path=/api/0.1/oauth/line`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ idToken }),
        })
        if (!res.ok) throw new Error('認証エラー')
        return res.json()
    }
};
