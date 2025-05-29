<template>
  <div>
    <!-- <HeaderBar /> -->
    <main class="pt-12">
      <section class="m-6 pb-25">
        <h2 class="mb-6 pr-6 font-bold text-[25px] text-neutral-700">今日の学習</h2>
        <DailyLessonCard
          @click="goToInterview"
        />
        <section class="mt-6">
          <h3 class="mb-4 text-2xl font-bold text-neutral-700">パーソナルトレーニング</h3>
          <TrainingCard
            title="SPI模擬試験"
            subtitle="まずは実践になれてみよう"
            image="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsaeV27nDz-IVdFElUzbj_KRwL4ye-J6CN-tHIp9tOzXJA5je90B_BcRcn1zjIqFJPhibqS5QTMS-CV6PPAq7dnU8T5Y9T1_IBaSMs2dq1MzHvtG-aVKP1VtXhxPoh9a3juRradbqG75Y/s800/test_shiken_businesswoman.png"
            @click="goToSPI"
          />
          <TrainingCard
            title="間違えた問題"
            subtitle="近日公開"
            image="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDuKsQjh9yiTox7xuwyEsO81xO7qSIPz9LmFfyXU58DYGIiFlUNkoeAkVFAt8u3QVmfif-jve_qSIf54fIyez1fuo9xAxonbCKS4RXFr24hGbACkanDNTXy_8kJLa99q-8ZAh3FNLUT6CH/s800/test_print_mondaiyoushi.png"
          />
        </section>
      </section>
    </main>
  </div>
</template>


<script setup>
import HeaderBar from '@/components/header/HeaderBar.vue'
import DailyLessonCard from '@/components/lesson/DailyLessonCard.vue'
import TrainingCard from '@/components/lesson/TrainingCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToSPI = () => {
  router.push({ name: 'spi' })
}

const goToInterview = () => {
  router.push({ name: 'Interview' })
}
</script>