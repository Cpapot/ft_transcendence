export default class Cookies {

    static get(name) {
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith(name))
            ?.split('=')[1];
        return (cookieValue || null);
    }

    static set(name, value) {
        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    static remove(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    static removeAll() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim().split('=')[0];
            Cookies.remove(cookie);
        }
    }
}

export function cookieHasConsent() {
    let cookieAccept = Cookies.get('cookieStatus');

    if (cookieAccept === null)
        return (null);
   return (cookieAccept === 'true');
}
