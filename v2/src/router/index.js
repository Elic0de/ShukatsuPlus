import { createWebHistory, createRouter } from 'vue-router'

import SignUp from '@/views/auth/Login.vue'
import ProfileV2 from '@/views/Profile.vue'
import FeedBack from '@/components/interview/FeedBack.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import RoomCreate from '@/views/interview/RoomCreate.vue'
import Room from '@/views/interview/Room.vue'
import ExamPage from '@/components/exam/ExamPage.vue'
import ExamResult from '@/components/exam/ExamResult.vue'
import Welecome from '@/views/Welecome.vue'
import Lesson from '@/views/Lesson.vue'
import AuthPage from '@/views/auth/AuthPage.vue'
import Interview from '@/views/interview/Interview.vue'
import ExamList from '@/components/exam/ExamList.vue'
import LeaderboardPage from '@/views/LeaderboardPage.vue'

const routes = [
  { path: '/', component: Welecome },
  { path: '/lesson', component: Lesson, meta: { showBottomNav: true } },
  { path: '/profile', component: ProfileV2, meta: { showBottomNav: true } },
  { path: '/leaderboard', component: LeaderboardPage, meta: { showBottomNav: true }  },
  { path: '/spi', name: 'spi', component: ExamList, meta: { showBottomNav: true } },
  { path: '/interview', name: 'Interview', component: Interview, meta: { showBottomNav: true } },

  { path: '/room/create', name: 'RoomCreate', component: RoomCreate },
  { path: '/room/:roomId', component: Room, props: true },
  { path: '/room/feedback/:roomId', component: FeedBack, props: true },

  { path: '/spi/:id', component: ExamPage, props: true },
  { path: '/spi/result/:id', component: ExamResult, props: true },

  { path: '/auth', component: AuthPage },
  { path: '/login', component: LoginPage   },
  { path: '/signup', component: SignUp },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router