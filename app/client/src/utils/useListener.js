export default async function useListener(paramName, callback) {
	const urlParams = new URLSearchParams(window.location.search);
	const paramValue = urlParams.get(paramName);
	if (paramValue != null)
		await callback(paramValue);
};
