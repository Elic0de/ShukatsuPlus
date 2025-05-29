<template>
  <div v-if="questions.length && !result">
    <h2>{{ currentQuestion.title }}</h2>
    <div class="timers">
      <Timer :seconds="totalTime" label="全体タイマー" />
      <Timer :seconds="localTimeLeft" label="問題タイマー" />
    </div>
    <form @submit.prevent="goToNextQuestion">
      <div class="question-box">
        <p>{{ currentPart.question }}</p>
        <div v-for="(text, key) in currentPart.choices" :key="key">
          <label>
            <input
              type="radio"
              :name="`choice_${currentPart.id}`"
              :value="key"
              v-model="answers[currentPart.id]"
            />
            {{ text }}
          </label>
        </div>
      </div>
      <button @click="submitExam" type="submit">次の問題へ</button>
    </form>
    <!-- Optional manual submission button -->
    <!-- <button @click="submitExam">試験を提出</button> -->
    <div v-if="currentQuestion.parts.length > 1" class="tabs">
      <div
        class="tab"
        v-for="(part, index) in currentQuestion.parts"
        :key="part.id"
        :class="{ active: selectedPartIndex === index }"
        @click="selectedPartIndex = index"
      >
        問{{ index + 1 }}
      </div>
    </div>
  </div>
  <div v-else-if="result">
    <h2>試験終了！</h2>
    <p>お疲れさまでした</p>
    <div class="result">
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Timer from './Timer.vue';
import { postGas } from "@/scripts/gas";

const BASE_URL = "https://script.google.com/macros/s/AKfycbw8lWyor28McmAj4JubiPM8fXX4YdoV0sTaR6-KCGt-e9Y7-GheBIv6ekOKSNmi8H0l/exec";

// Assume exam id comes as a prop (via route params)
const props = defineProps({
  id: {
    type: String,
    required: true,
  }
});

// Local state using composition API
const questions = ref([]);
const currentIndex = ref(0);
const selectedPartIndex = ref(0);
const answers = ref({});
const sessionId = ref(null);
const result = ref(null);
const totalTime = ref(35 * 60);
const localTimeLeft = ref(30);
let globalTimer = null;
let questionTimer = null;


// Computed properties for current question and its part
const currentQuestion = computed(() => questions.value[currentIndex.value] || {});
const currentPart = computed(() => {
  if (currentQuestion.value.parts) {
    return currentQuestion.value.parts[selectedPartIndex.value];
  }
  return {};
});

// Watcher: reset selected part when current question changes
watch(currentIndex, () => {
  selectedPartIndex.value = 0;
});

// Start exam and fetch details on component mount
onMounted(async () => {
  await startExam(props.id);
  startGlobalTimer();
  startQuestionTimer();
});

async function startExam(id) {
  try {
    sessionId.value = id;

    const examDetailRes = await fetch(`${BASE_URL}?action=getExamDetail&exam_id=${id}`);
    const examData = await examDetailRes.json();
    questions.value = examData;
  } catch (error) {
    console.error("Error starting exam:", error);
  }
}

async function submitExam() {
  try {
    const res = await fetch(`${BASE_URL}?action=submitAnswer`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        session_id: sessionId.value,
        answers: answers.value
      })
    });
    const resultData = await res.json();
    if (resultData.error) {
      return;
    }
    // result.value = resultData;
  } catch (error) {
    console.error("Error submitting exam:", error);
  }
}

function goToNextQuestion() {
  // Optionally, an answer submission can be done here per question.
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    cleanupQuestionTimer();
    startQuestionTimer();
  } else {
    cleanupGlobalTimer();
    cleanupQuestionTimer();
    submitExam();
  }
}

function startGlobalTimer() {
  globalTimer = setInterval(() => {
    totalTime.value--;
    if (totalTime.value <= 0) {
      cleanupGlobalTimer();
      cleanupQuestionTimer();
      submitExam();
    }
  }, 1000);
}

function startQuestionTimer() {
  // Set initial question time, from question property or fallback to 30s.
  localTimeLeft.value = currentQuestion.value.time_limit || 30;
  questionTimer = setInterval(() => {
    localTimeLeft.value--;
    if (localTimeLeft.value <= 0) {
      cleanupQuestionTimer();
      goToNextQuestion();
    }
  }, 1000);
}

function cleanupGlobalTimer() {
  if (globalTimer) {
    clearInterval(globalTimer);
    globalTimer = null;
  }
}

function cleanupQuestionTimer() {
  if (questionTimer) {
    clearInterval(questionTimer);
    questionTimer = null;
  }
}
</script>

<style scoped>
.question-box {
  margin-bottom: 1rem;
}
.tabs {
  margin-top: 1rem;
}
.tab {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  background-color: #f0f0f0;
}
.tab.active {
  background-color: #d0d0d0;
}
.timers {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.result {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ccc;
}
</style>