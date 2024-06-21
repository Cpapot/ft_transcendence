import Cookies, { cookieHasConsent } from '../Cookies.js';

export default async function useLanguage(lang) {
    try {
        const response = await fetch('/languages/' + lang + '.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok)
            throw new Error('Error: ' + response.status);

        let language = await response.json();
        language['lang'] = lang;

        if (cookieHasConsent() === true)
            Cookies.set('lang', lang);

        return (language);
    } catch (error) {
        console.error(error);
    }
}
