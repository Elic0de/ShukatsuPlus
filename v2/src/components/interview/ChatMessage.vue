<template>
    <div :class="[message.speaker === 'user' ? 'text-right' : 'text-left']">
        <div class="inline-block p-3 rounded-xl max-w-xs shadow"
            :class="message.speaker === 'user' ? 'bg-green-100' : 'bg-gray-100'">
            <p v-if="message.isCorrect" class="font-bold text-green-600 mb-1">すばらしい ✔</p>
            <p class="text-base">{{ message.text }}</p>
            <p v-if="message.subtext" class="text-sm text-gray-600 mt-1">{{ message.subtext }}</p>
            <FeedbackIcons v-if="message.speaker === 'user' || message.subtext" />
        </div>
    </div>
</template>

<script setup>
import FeedbackIcons from './FeedbackIcons.vue'

defineProps({
    message: Object
})
</script>
