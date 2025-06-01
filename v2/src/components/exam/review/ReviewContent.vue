<template>
    <div class="question-box leading-7 font-normal">
        <div class="sticky top-0 mb-2 border-b-2 border-neutral-200 bg-white p-2">
            <p class="pb-6">{{ part.question }}</p>
        </div>

        <div class="space-y-4 pb-6">
            <div class="flex items-center gap-2">
                <span
                class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold"
                :class="isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" v-if="isCorrect" />
                    <path d="M6 18L18 6M6 6l12 12" v-else />
                </svg>
                {{ isCorrect ? '正解！' : '不正解' }}
                </span>
            </div>

            <div>
                <span class="text-sm font-semibold text-neutral-500">正解</span>
                <div class="mt-1 rounded-xl border-2 border-green-400 bg-green-50 px-3 py-2 text-lg font-bold text-green-700 shadow-sm">
                    {{ part.choices[correctAnswer] }}
                </div>
            </div>

            <div>
                <span class="text-sm font-semibold text-neutral-500">あなたの解答</span>
                <div class="mt-1 rounded-xl border-2 border-neutral-300 bg-white px-3 py-2 text-lg font-bold text-neutral-700 shadow-sm">
                    {{ part.choices[userAnswer] || '未解答' }}
                </div>
            </div>
        </div>

        <div class="mb-8">
            <h3 class="mb-2 text-base font-semibold text-indigo-600">解説</h3>
            <div class="rounded-lg bg-indigo-50 p-3 text-sm leading-relaxed text-neutral-700 shadow">
                {{ explanation }}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue'

    const props = defineProps({
        part: Object,
        correctAnswer: String,
        userAnswer: String,
        explanation: String
    })

    const isCorrect = computed(() => props.correctAnswer === props.userAnswer)
</script>
