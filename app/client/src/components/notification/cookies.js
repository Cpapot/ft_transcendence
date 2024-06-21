import Cookies from '@src/Cookies.js';
import Component from '@components/Component.js';

export default class ClientCookies extends Component {
    constructor() {
        super();

        this.name = 'cookies';
    }

    events() {

        const setCookie = (event) => {
            Cookies.set("cookieStatus", event.target.getAttribute('value'));
            this.remove();
        }
        this.addEventListener('.cookies-button[value="true"]', 'click', setCookie);
        this.addEventListener('.cookies-button[value="false"]', 'click', setCookie);
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    render() {
        return (`
            <div class="border" style="background-color: #fff; position: fixed; width: 420px; bottom: 20px; left: 20px;" id="cookiePopup">
                <p class="cookies-text" style="padding: 5px; font-size: 12px; font-family: 'ImportBold';" key="cookies_text"></p>
                <button class="cookies-button btn btn-primary" style="padding: 10px 5px; font-size: 14px; font-family: 'ImportBold'; margin-left: 5px;" key="cookies_accept" value="true"></button>
                <button class="cookies-button btn btn-danger" style="padding: 10px 5px; font-size: 14px; font-family: 'ImportBold';" key="cookies_refuse" value="false"></button>
            </div>
        `)
    }
}