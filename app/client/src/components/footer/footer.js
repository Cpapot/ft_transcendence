import Component from '@components/Component.js';

export default class ClientFooter extends Component {
    constructor() {
        super();

        this.name = 'footer';
    }

    events() {
        this.addEventListener('.privacy-link', 'click', (event) => {
            event.preventDefault();
            window.route.loadView("/privacy");
        });
    }

    disconnectedCallback() {
        this.removeEventListener('.privacy-link', 'click');
    }

    render() {
        return (`
            <footer class="footer py-3 text-center">
                <a href="/privacy" class="privacy-link text-white"></a>
            </footer>
        `)
    }
}