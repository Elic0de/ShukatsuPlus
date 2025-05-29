<template>
    <div class="relative">
        <div class="flex rounded-2xl border-2 border-neutral-200 px-3.5 pt-2 pb-2.5">
            <img class="mr-1.75" :src="iconUrl" />
            <div class="_3eRJb">
                <h4 class="mb-1 text-xl font-bold text-neutral-700">{{ value }}</h4>
                <div class="text-neutral-400">{{ label }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    iconUrl: String,
    value: [String, Number],
    label: String
})
</script>
