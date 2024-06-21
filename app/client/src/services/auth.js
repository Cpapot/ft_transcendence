import useFetch from "@utils/useFetch";

export default class Authentication {
	static async set(params_table) {
		return (await useFetch("/auth/user/", "POST", { input: params_table }));
	}

	static async verify_user(user) {
		return (await useFetch("/auth/verify_user/", "POST", { input : user }));
	}

	static async verify(token) {
		return (await useFetch("/auth/verify/", "POST", { input : token }));
	}

	static async refresh(token) {
		return (await useFetch("/auth/refresh/", "POST", { input : token }));
	}

	static async resetPassword(email) {
		return (await useFetch("/auth/reset_password/", "POST", { input : email }));
	}
}

export async function isAuth() {
	const token = localStorage.getItem('PRODLoginData');
	if (token) {
		const response = await Authentication.verify({ token });
		if (response.ok)
			return (true);

		const refreshToken = localStorage.getItem('PRODRefreshData');
		if (refreshToken) {
			const response = await Authentication.refresh({ refreshToken });
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('PRODLoginData', data.access);
				return (true);
			}
		}
	}
	return (false);
}
