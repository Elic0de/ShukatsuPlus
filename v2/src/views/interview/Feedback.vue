<template>
  <div class="flex flex-col gap-3 bg-neutral-100 p-4 min-h-screen">

    <!-- タイトル -->
    <div class="text-center">
      <h1 class="text-2xl font-bold text-neutral-800">{{ data.title }}</h1>
    </div>

    <!-- 面接サマリー -->
    <InterviewSummary :summaryText="data.interviewSummary" />

    <!-- チャットループ -->
    <div class="flex flex-col gap-3 pb-40">
        <template v-for="(item, index) in data.chat" :key="index">
            <ChatBubble
                :message="item.message"
                :isUser="item.sender === 'あなた'"
                :sender="item.sender !== 'あなた' ? item.sender : ''"
            >
                <!-- あなたの発言に対してのみ改善提案表示 -->
                <FeedbackBubble
                    v-if="item.suggestedImprovement"
                    :suggestion="item.suggestedImprovement"
                />
            </ChatBubble>
        </template>
    </div>
  </div>
</template>


<script setup>
    import ChatBubble from '@/components/feedback/ChatBubble.vue'
    import FeedbackBubble from '@/components/feedback/FeedbackBubble.vue'
    import InterviewSummary from '@/components/feedback/InterviewSummary.vue'

    const data = {
        title: "面接のフィードバックを見てみよう",
        interviewSummary: `あなたの受け答えは丁寧で前向きな姿勢が伝わりました。
            ただし、抽象的な表現が多く、具体性に欠ける箇所が見受けられました。
            企業への関心や貢献意欲を、もっと明確な言葉で表現できるとより良い印象を与えられます。`,
        chat: [
            {
                sender: "あなた",
                message: "御社は有名だし、好きなので参加したい。",
                suggestedImprovement: "私は貴社の革新性と企業文化に感銘を受け、その継続的な成功に貢献したいと考えています。"
            },
            {
                sender: "面接官",
                message: "ご回答ありがとうございます！"
            },
            {
                sender: "あなた",
                message: "前職では色々やってきました。",
                suggestedImprovement: "前職ではプロジェクト管理やチームリーダーとしての経験を通じて、複数の業務改善に貢献してきました。"
            },
            {
                sender: "面接官",
                message: "なるほど、もう少し具体的に教えてもらえますか？"
            },
            {
                sender: "あなた",
                message: "リーダー的なこともしたし、売上も伸びました。",
                suggestedImprovement: "チームを率いて年間売上を15%向上させた実績があります。具体的には、顧客対応のフローを見直し、業務効率化を図りました。"
            },
            {
                sender: "面接官",
                message: "それは素晴らしいですね。"
            }
        ]
    }
</script>
