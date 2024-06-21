import useFetch from "@utils/useFetch";

export default class Game {
  static async get(gameData) {
	  return (await useFetch("/game/", "POST", { input : gameData, requireToken : true }));
  }

	static async play(gameData) {
		return (await useFetch("/game/play/", "POST", { input : gameData, requireToken : true }));
  }

  static async status(gameData) {
    return (await useFetch("/game/status/", "POST", { input : gameData, requireToken : true }));
  }
}
