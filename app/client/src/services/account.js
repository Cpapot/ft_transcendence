import useFetch from "@utils/useFetch";

export default class Account {
  static async changePassword(params_table) {
    return (await useFetch('/account/change_password/', 'POST', { input : params_table}));
  }

  static async verifyTwoFa(method, code) {
    return (await useFetch('/account/verify_two_fa/', method, { input : code, requireToken : true }));
  }

  static async changeTwoFa() {
    return (await useFetch('/account/change_two_fa/', 'GET', { requireToken : true }));
  }

  static async delete() {
    return (await useFetch('/account/delete/', 'DELETE', { requireToken : true }));
  }
}
