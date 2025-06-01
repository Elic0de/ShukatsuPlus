import { createWebHashHistory, createRouter } from "vue-router";

import Welcome from "@/views/Welcome.vue";
//
import AuthPage from "@/views/auth/AuthPage.vue";
import SignUp from "@/views/auth/Login.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import AccountManager from "@/components/auth/AccountManager.vue";

//
import RoomCreate from "@/views/interview/RoomCreate.vue";
import Room from "@/views/interview/Room.vue";

//
import Lesson from "@/views/Lesson.vue";
import ExamList from "@/views/exam/ExamList.vue";
import Interview from "@/views/interview/Interview.vue";
import LeaderboardPage from "@/views/LeaderboardPage.vue";
import Profile from "@/views/Profile.vue";
import ExamPage from "@/views/exam/ExamPage.vue";
import ReviewPage from "@/views/exam/ReviewPage.vue";
import LineAuth from "@/views/auth/LineAuth.vue";

import Feedback from "@/views/interview/Feedback.vue";
import InterviewChat from "@/views/interview/InterviewChat.vue";

import { applySessionGuard } from "@/router/guards/sessionGuard";

// prettier-ignore
const routes = [
	{ path: "/", component: Welcome },
	{ path: "/lesson", component: Lesson, meta: { showBottomNav: true } },
	{ path: "/profile", component: Profile, meta: { showBottomNav: true } },
	{ path: "/leaderboard", component: LeaderboardPage, meta: { showBottomNav: true } },
	{ path: "/spi", name: "spi", component: ExamList, meta: { showBottomNav: true } },
	{ path: "/interview", name: "Interview", component: Interview, meta: { showBottomNav: true } },

	{ path: "/room/create", name: "RoomCreate", component: RoomCreate },
	{ path: "/room/:roomId", name: "Room", component: Room, props: true },
	{ path: "/room/feedback/:roomId", component: Feedback, props: true },

	{ path: "/chat", component: InterviewChat, props: true },

	{ path: "/spi/:sessionId", component: ExamPage, props: true },
	{ path: "/spi/review/:sessionId", component: ReviewPage, props: true },
	// { path: "/spi/review/:id", component: ExamResult, props: true },

	{ path: "/auth", component: AuthPage },
	{ path: "/login", component: AccountManager },
	{ path: "/signup", component: SignUp },
	{ path: "/oauth/line", component: LineAuth },
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

applySessionGuard(router);

export default router;
