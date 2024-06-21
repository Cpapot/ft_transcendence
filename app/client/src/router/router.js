import Routes from './routes.js';
import useLanguage from '../utils/useLanguage.js';

export default class Router {
	constructor() {
		this.locale = {};
		this.routes = Routes;

		window.addEventListener('popstate', () => {
			this.loadView(window.location.pathname, false);
		});
	}

	getRouteFromView(path) {
		return (this.routes.find(route => route.path === path));
	}

	getTextContent() {
		const elements = document.querySelectorAll('[key]');
		elements.forEach(element => {
			const key = element.getAttribute('key');
			(this.locale[key]) && (element.textContent = this.locale[key]);
		});
		const shadowElements = document.querySelectorAll('client-footer');
		shadowElements.forEach(element => {
			element.shadowRoot.querySelector('.privacy-link').textContent = this.locale.privacy;
		});
	}

	getDefaultLocale() {
		return (navigator.language.split('-')[0] || 'en');
	}

	getLocaleValue(value) {
		return (this.locale[value]);
	}

	async setLocale(locale) {
		const storageLang = ['en', 'fr', 'es', 'de'];
		if (!storageLang.includes(locale))
			locale = this.getDefaultLocale();

		this.locale = await useLanguage(locale);
		const currentURL = new URL(window.location.href);
		currentURL.searchParams.set('lang', this.locale.lang);

		const defaultLang = this.getDefaultLocale();
		if (this.locale.lang === defaultLang)
			currentURL.searchParams.delete('lang');
		window.history.replaceState({}, '', decodeURIComponent(currentURL.href));
		this.getTextContent();
	}

	#navigate(newPath) {
		let currentURL = new URL(window.location.href);
		let newURL = new URL(newPath || window.location.pathname, window.location.origin);

		const lang = currentURL.searchParams.get('lang');
		const defaultLang = this.getDefaultLocale();

		if (lang !== null && lang !== defaultLang && this.locale.lang !== defaultLang)
			newURL.searchParams.set('lang', this.locale.lang);

		if (newURL.href !== currentURL.href)
			window.history.pushState({}, '', decodeURIComponent(newURL.href));
	}

	#loadComponent(route, component, action) {
		if ((!route || !route.extend)) {
			if (!document.querySelector(component)) {
				if (action === 'append')
					document.body.appendChild(document.createElement(component));
				else if (action === 'prepend')
					document.body.insertBefore(document.createElement(component), document.body.firstChild);
			}
		}
		else
			document.querySelector(component)?.remove();
	}

	async loadView(view, update = true) {
		const main = document.getElementById('main');
		main.innerHTML = '';

		const viewPath = view.split('?')[0] || view;
		let route = this.getRouteFromView(viewPath);
		const component = {
			'prepend': 'client-navigation',
			'append': 'client-footer'
		};
		for (const key in component)
			this.#loadComponent(route, component[key], key);

		if (!route)
			route = this.getRouteFromView('/error');

		if (!route.require_storage && localStorage.getItem('TEMPAuthEmail'))
			localStorage.removeItem('TEMPAuthEmail');
		
		else if (route.require_storage && !localStorage.getItem(route.require_storage))
			return (this.loadView('/auth'));
		else if (route.require_params && !route.require_params.every(param => new URLSearchParams(window.location.search).has(param)))
			return (this.loadView('/auth'));

		// const isUserAuthenticated = localStorage.getItem('PRODLoginData')
		// if (route.auth === true && !isUserAuthenticated)
		// 	return (this.loadView('/auth'));
		// else if (route.auth === false && isUserAuthenticated)
		// 	return (this.loadView('/'));

		else if (route.auth && !localStorage.getItem('PRODLoginData'))
			return (this.loadView('/auth'));

		if (update)
			this.#navigate(view);
		await route.component(main);
		this.getTextContent();
	}
}