import useFetch from "@utils/useFetch";

export default class Tournament {
  static async all() {
    return await useFetch('/tournament/all/', 'GET', { requireToken : true });
  }

	static async create(param) {
		return (await useFetch('/tournament/create/', 'POST', { input : param, requireToken : true }));
  }

  static async join(param) {
	  return (await useFetch('/tournament/join/', 'POST', { input : param, requireToken : true }));
  }
}
