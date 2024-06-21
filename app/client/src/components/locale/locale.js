import Component from '@components/Component.js';

export default class ClientLocale extends Component {
    constructor() {
        super();

        this.name = 'locale';
        this.LanguageStorage = {
            "English": "en",
            "Français": "fr",
            "Español": "es",
            "Deutsch": "de"
        };
    }

    events() {
        this.mouseX = this.getAttribute('mouseX');
        this.mouseY = this.getAttribute('mouseY');

        this.languageList = this.getShadowRoot().querySelector('.language-list');
        document.addEventListener('mousemove', (event) => {
            if (event.clientX > this.mouseX + this.languageList.offsetWidth - 80 ||
                event.clientX < this.mouseX - this.languageList.offsetWidth + 80 ||
                event.clientY > this.mouseY + this.languageList.offsetHeight + 80) {
                this.remove();
            }
        });

        const allLocaleValues = this.getShadowRoot().querySelectorAll('.locale-value');
        allLocaleValues.forEach(localeValue => {
            localeValue.addEventListener('click', function (event) {
                event.preventDefault();
                const lang = this.getAttribute('href').split('=')[1];
                window.route.setLocale(lang);

                allLocaleValues.forEach(item => {
                    item.style.color = '#aaaaae';
                });

                event.target.style.color = 'white';
                const languageList = event.currentTarget.parentElement;
                if (languageList)
                    languageList.remove();
            });
        });
    }

    render() {
        return (`
            <style>
                .locale-value {
                    text-align: center;
                    color: #aaaaae;
                    text-decoration: none;
                }
                .locale-value:hover {
                    color: white;
                }
                .current-lang {
                    color: white;
                }
            </style>
            <div class="card p-2 language-list" style="width: 100px; position: absolute; margin-top: 15px; margin-left: -30px; align-items: stretch; display: flex; flex-direction: column; gap: 0.2rem; background-color: #313234; font-size: 16px;">
                ${Object.keys(this.LanguageStorage).map(lang => `
                    <a class="locale-value p-1 ${
                        this.LanguageStorage[lang] === window.route.getLocaleValue("lang") ? 'current-lang' : ''
                    }" href="?lang=${this.LanguageStorage[lang]}">${lang}</a>
                `).join('')}
            </div>
        `);
    }
}
