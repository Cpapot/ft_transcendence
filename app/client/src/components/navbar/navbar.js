import Component from '@components/Component.js';
import { isAuth } from '@services/auth';

export default class ClientNavigation extends Component {
    constructor() {
        super();

        this.name = 'navigation';
    }

    async events() {
        const AuthSuccess = await isAuth();

        this.addEventListener('.lang-selected', 'mouseenter', (event) => {
            const clientLocale = this.shadowRoot.querySelector('client-locale');
            if (!clientLocale) {
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                const clientLocaleElement = document.createElement('client-locale');
                clientLocaleElement.setAttribute('mouseX', mouseX);
                clientLocaleElement.setAttribute('mouseY', mouseY);
                this.shadowRoot.querySelector('.lang-selected').appendChild(clientLocaleElement);
            }
        });

        this.addEventListener('.sign-in', 'click', async () => {
            (AuthSuccess) ? window.route.loadView('/profile') : window.route.loadView('/auth');
        });

        if (AuthSuccess) {
            const account = this.shadowRoot.querySelector('.current-img-account');
            const userData = JSON.parse(localStorage.getItem('PRODProfile'));

            if (!userData || !userData.avatar)
                return ;
    
            account.innerHTML = '';
            const userImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            userImage.setAttribute('href', userData.avatar);
            userImage.setAttribute('width', '32');
            userImage.setAttribute('height', '32');
            userImage.setAttribute('clip-path', 'circle(16px at 16px 16px)');
            account.appendChild(userImage);
        }
    }
    
    disconnectedCallback() {
        this.removeEventListener('.lang-selected', 'mouseenter');
        this.removeEventListener('.sign-in', 'click');
    }

    render() {
        return (`
            <style>
                .navbar-nav .nav-item .nav-link:hover {
                    opacity: 0.7;
                }
            </style>
            
            <nav class="div" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
                <button class="navbar-brand d-flex align-items-center p-4" style="background-color: transparent; border: none;" onclick="window.route.loadView('/')">
                    <img style="width: 65px; height: 65px; margin-right: 22px;" src="/img/home/logo.png">
                    <h1 class="mb-0" style="color: white;">TRANSCENDENCE</h1>
                </button>
                <ul class="navbar-nav d-flex flex-row" style="margin-right: 20px;">
                    <li class="nav-item btn">
                        <summary class="nav-link" style="transition: opacity 0.3s ease-in-out;">
                            <div class="lang-selected">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="img-fluid">
                                    <path fill-rule="evenodd" d="M3.784 11.25h3.99c.153-2.35.994-4.44 1.815-5.969.282-.525.564-.988.82-1.378a8.255 8.255 0 0 0-6.625 7.347ZM12 4.232c-.305.43-.697 1.03-1.09 1.759-.75 1.398-1.481 3.237-1.632 5.259h5.444c-.15-2.022-.882-3.861-1.633-5.259-.392-.73-.784-1.33-1.089-1.76Zm2.722 8.518H9.278c.15 2.022.882 3.861 1.633 5.259.392.73.784 1.33 1.089 1.76.305-.43.697-1.03 1.09-1.76.75-1.398 1.481-3.237 1.632-5.259Zm-4.313 7.347c-.256-.39-.538-.853-.82-1.378-.82-1.528-1.662-3.618-1.815-5.969h-3.99a8.255 8.255 0 0 0 6.625 7.347Zm3.182 0c.256-.39.538-.853.82-1.378.82-1.528 1.662-3.618 1.815-5.969h3.99a8.255 8.255 0 0 1-6.625 7.347Zm6.625-8.847h-3.99c-.153-2.35-.994-4.44-1.815-5.969a18.45 18.45 0 0 0-.82-1.378 8.255 8.255 0 0 1 6.625 7.347ZM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                        </summary>
                    </li>
                    <li class="nav-item btn">
                        <a class="nav-link sign-in" style="transition: opacity 0.3s ease-in-out;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="img-fluid current-img-account">
                                <rect width="32" height="32" fill="#303034" rx="16"></rect>
                                <path fill-rule="evenodd" d="M16 9.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.25 12a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Zm.39 6.75a1.25 1.25 0 0 0-1.226 1.005l-.678 3.392a.75.75 0 1 1-1.471-.294l.678-3.392a2.75 2.75 0 0 1 2.697-2.211h6.72a2.75 2.75 0 0 1 2.697 2.21l.679 3.393a.75.75 0 0 1-1.471.294l-.679-3.392a1.25 1.25 0 0 0-1.226-1.005h-6.72Z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        `);
    }
}
