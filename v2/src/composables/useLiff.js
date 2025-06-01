export const useLiff = async () => {
	const liff = (async function() {
		try {
			return await import("@line/liff");
		} catch (e) {
			return null;
		}
	})();

	const login = () => {
		if (liff && !liff.isLoggedIn()) liff.login();
	};

	const getIdToken = () => liff && liff.getIDToken();

	return { login, getIdToken };
};
