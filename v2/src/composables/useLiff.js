import liff from "@line/liff";

export const useLiff = () => {
	const login = () => {
		if (!liff.isLoggedIn()) liff.login();
	};

	const getIdToken = () => liff.getIDToken();

	return { login, getIdToken };
};
