<template>
  <div class="p-4 bg-white shadow flex flex-col gap-2">
    <div class="flex gap-2">
      <input
        type="text"
        class="flex-1 border rounded px-2 py-1"
        v-model="modelValue"
        :readonly="searchOngoing"
      />
      <button class="bg-blue-500 text-white px-3 py-1 rounded" @click="$emit('send')">送信</button>
      <button
        :class="[
          'px-3 py-1 rounded',
          voiceOngoing ? 'bg-red-500 text-white' : 'bg-gray-300',
          !speechRecognitionAvailable && 'grayscale'
        ]"
        @click="$emit('toggleVoice')"
      >
        {{ voiceOngoing ? '停止' : '音声' }}
      </button>
    </div>

    <label class="flex items-center text-sm">
      <input type="checkbox" v-model="voiceAutoSend" class="mr-2" />
      音声自動送信
    </label>

    <div class="text-sm text-red-500">{{ voiceErrorMessage }}</div>

    <div class="flex flex-col gap-2 mt-2">
      <label class="text-sm">
        声:
        <select v-model="voiceSelected" @change="$emit('updateVoice')" class="ml-2 border rounded px-1">
          <option v-for="option in voiceOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </label>

      <label class="text-sm">
        Gemini APIキー:
        <input type="password" v-model="geminiApiKey" class="ml-2 border rounded px-2 py-1" />
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps([
  'modelValue',
  'voiceAutoSend',
  'voiceOngoing',
  'speechRecognitionAvailable',
  'searchOngoing',
  'voiceErrorMessage',
  'geminiApiKey',
  'voiceSelected',
  'voiceOptions',
])
defineEmits(['update:modelValue', 'send', 'toggleVoice', 'updateVoice'])

const modelValue = defineModel()
</script>
