import ClientCookies from './notification/cookies.js';
import ClientNavigation from './navbar/navbar.js';
import ClientLocale from './locale/locale.js';
import ClientFooter from './footer/footer.js';
import NotifAuth from './notification/auth.js';

customElements.define('client-cookies', ClientCookies);
customElements.define('client-navigation', ClientNavigation);
customElements.define('client-locale', ClientLocale);
customElements.define('client-footer', ClientFooter);
customElements.define('notif-auth', NotifAuth);