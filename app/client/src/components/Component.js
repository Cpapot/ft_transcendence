import { addGlobalStylesToShadowRoot } from "@helpers/global.js";

export default class Component extends HTMLElement {
    #eventListener = [];
    #rendered = false;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        addGlobalStylesToShadowRoot(this.shadowRoot);
    }

    getShadowRoot() {
        return (this.shadowRoot);
    }

    getTextContent() {
        const elements = this.shadowRoot.querySelectorAll('[key]');
        elements.forEach(element => {
            const key = element.getAttribute('key');
            (window.route.locale[key]) && (element.textContent = window.route.locale[key]);
        });
    }

    connectedCallback() {
        if (this.#rendered)
            return ;

        const render = this.render();
        if (render === false) return;

        this.shadowRoot.innerHTML = render;
        this.#rendered = true;

        if (this.events)
            this.events();

        this.getTextContent();
    }

    addEventListener(selector, event, callback) {
        if (!selector) return;

        const element = this.shadowRoot.querySelector(selector);
        if (!element) return;
    
        if (!this.#eventListener[event]) 
            this.#eventListener[event] = [];
  
        const eventCallback = callback.bind(this);
        this.#eventListener[event].push({element, eventCallback});
        element.addEventListener(event, eventCallback);
    }

    removeEventListener(selector, event) {
        const eventListeners = this.#eventListener[event];
    
        if (eventListeners) {
            for (const eventListener of eventListeners) {
                if (eventListener.element === selector) {
                    element.removeEventListener(event, eventListener.eventCallback);
                    eventListeners.splice(eventListeners.indexOf(eventListener), 1);
                }
            }
        }
    }

    removeEventListeners() {
        for (const event in this.#eventListener) {
            for (const eventListener of this.#eventListener[event]) {
                eventListener.element.removeEventListener(event, eventListener.eventCallback);
            }
        }
    }
}
