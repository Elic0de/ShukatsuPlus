<template>
  <div class="flex flex-col gap-6 bg-neutral-100 p-4 min-h-screen">

    <!-- タイトルと面接サマリー -->
    <div class="text-center">
      <h1 class="text-2xl font-bold text-neutral-800">ロールプレイのフィードバックを見てみよう</h1>
    </div>

    <InterviewSummary :summaryText="summary" />

    <!-- チャットバブル（あなた） -->
    <ChatBubble :message="userMessage" :isUser="true">
        <FeedbackBubble
            :suggestion="geminiFeedback"
        />
    </ChatBubble>

    <!-- チャットバブル -->
    <ChatBubble sender="面接官" message="ご回答ありがとうございます！"/>
  </div>
</template>

<script setup>
    import ChatBubble from '@/components/feedback/ChatBubble.vue'
    import FeedbackBubble from '@/components/feedback/FeedbackBubble.vue'
    import InterviewSummary from '@/components/feedback/InterviewSummary.vue'

    const summary = `あなたの受け答えは丁寧で前向きな姿勢が伝わりました。
    ただし、抽象的な表現が多く、具体性に欠ける箇所が見受けられました。
    企業への関心や貢献意欲を、もっと明確な言葉で表現できるとより良い印象を与えられます。`

    const userMessage = '御社は有名だし、好きなので参加したい。'
    const geminiFeedback = "私は貴社の革新性と企業文化に感銘を受け、その継続的な成功に貢献したいと考えています。"
</script>
