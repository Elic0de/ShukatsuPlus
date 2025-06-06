import { useSessionStore } from "@/stores/session";

export function applySessionGuard(router) {
	router.beforeEach((to, from, next) => {
		const session = useSessionStore();

		if (to.path === "/") {
			console.log(
				session.isSessionValid.value
					? "Session is valid"
					: "Session is invalid"
			);
			console.log(session.userId.value);
			next(session.isSessionValid.value ? "/lesson" : "/login");
			return;
		}

		if (to.path === "/login" || to.path === "/oauth/line") {
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
