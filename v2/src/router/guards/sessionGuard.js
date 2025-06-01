import { useSessionStore } from "@/stores/session";

export function applySessionGuard(router) {
	router.beforeEach((to, from, next) => {
		const session = useSessionStore();

		if (to.path === "/") {
			next(session.isSessionValid.value ? "/lesson" : "/login");
			return;
		}

		if (to.path === "/login") {
			// 既にログイン済みなら redirect クエリがあればそこへ、それ以外は /lesson
			if (session.isSessionValid.value) {
				const redirect = to.query.redirect || "/lesson";
				next(redirect);
			} else {
				next();
			}
			return;
		}

		// ログインが必要なページに未ログインで来た場合
		if (!session.isSessionValid.value) {
			next({
				path: "/login",
				query: { redirect: to.fullPath },
			});
			return;
		}

		next();
	});
}
