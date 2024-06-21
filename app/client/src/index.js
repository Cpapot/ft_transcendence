import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import '@components';

import Cookies, { cookieHasConsent } from './Cookies.js';
import Services from '@services';
import { SetAuthStorage } from '@security/authStorage.js';
import AuthNotification from '@views/notification/authNotification.js';
import useListener from '@utils/useListener.js';
import Router from '@router/router.js';

function getBrowserLocales() {
    const defaultLocale = 'en';
    if (!navigator.languages || navigator.languages.length === 0)
        return [defaultLocale];

    return (navigator.languages.map(locale => locale.split('-')[0]));
}

async function InitializeApp() {
    const router = new Router();
    window.route = router;

    const consent = cookieHasConsent();
    if (consent === null)
        document.body.appendChild(document.createElement('client-cookies'));

    const cookie = consent === true && Cookies.get('lang') || null;
    const queryParams = new URLSearchParams(window.location.search).getAll('lang');
    const urlParams = queryParams.length > 1 ? null : queryParams[0];

    await router.setLocale(urlParams || cookie || getBrowserLocales());

    window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin)
            return;
    
        const { type, data } = event.data;
        if (type === 'SetAuthStorage')
            SetAuthStorage(data);
        else if (type === 'AuthNotification')
            AuthNotification(data);
    });

    useListener('code', async (code) => {
        const response = await Services.Authentication.set({ 
            code: code
        });
        const data = await response.json();
        (response.ok && window.opener)
            ? window.opener.postMessage({ type: 'SetAuthStorage', data: data }, window.location.origin)
            : window.opener.postMessage({ type: 'AuthNotification', data: data.message }, window.location.origin);

        window.close();
    });

	document.body.innerHTML += `
        <main 
            id="main" 
            class="flex-grow-1 d-flex flex-wrap justify-content-center align-items-center">
        </main>
    `;
    router.loadView(window.location.pathname, false);
};

document.addEventListener('DOMContentLoaded', InitializeApp);
