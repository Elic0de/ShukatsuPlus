import { createWebHistory, createRouter } from 'vue-router'

import Welecome from '@/views/Welecome.vue'
// 
import AuthPage from '@/views/auth/AuthPage.vue'
import SignUp from '@/views/auth/Login.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
//
import RoomCreate from '@/views/interview/RoomCreate.vue'
import Room from '@/views/interview/Room.vue'
import FeedBack from '@/components/interview/FeedBack.vue'

// 
//
import Lesson from '@/views/Lesson.vue'
import ExamList from '@/views/exam/ExamList.vue'
import Interview from '@/views/interview/Interview.vue'
import LeaderboardPage from '@/views/LeaderboardPage.vue'
import Profile from '@/views/Profile.vue'
import ExamPage from '@/views/exam/ExamPage.vue'
import ReviewPage from '@/views/exam/ReviewPage.vue'
import LineAuth from '@/views/auth/LineAuth.vue'

const routes = [
  { path: '/', component: Welecome },
  { path: '/lesson', component: Lesson, meta: { showBottomNav: true } },
  { path: '/profile', component: Profile, meta: { showBottomNav: true } },
  { path: '/leaderboard', component: LeaderboardPage, meta: { showBottomNav: true }  },
  { path: '/spi', name: 'spi', component: ExamList, meta: { showBottomNav: true } },
  { path: '/interview', name: 'Interview', component: Interview, meta: { showBottomNav: true } },

  { path: '/room/create', name: 'RoomCreate', component: RoomCreate },
  { path: '/room/:roomId', name: 'Room', component: Room, props: true },
  { path: '/room/feedback/:roomId', component: FeedBack, props: true },

  { path: '/spi/:sessionId', component: ExamPage, props: true },
  { path: '/spi/review/:sessionId', component: ReviewPage, props: true },
  // { path: '/spi/review/:id', component: ExamResult, props: true },

  { path: '/auth', component: AuthPage },
  { path: '/login', component: LoginPage   },
  { path: '/signup', component: SignUp },
  { path: '/oauth/line', component: LineAuth },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router