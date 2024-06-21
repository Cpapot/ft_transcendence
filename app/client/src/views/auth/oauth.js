import createElement from '@helpers/element.js';

export default function initialize(wrapper) {
    const loadingGif = createElement('img', {
        src: 'img/home/loading.gif',
        style: 'width: 350px; height: 350px;'
    });
    wrapper.appendChild(loadingGif);
}
