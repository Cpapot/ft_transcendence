import createElement from '@helpers/element.js';

export default function initialize(wrapper) {
    let errorContainer = createElement('div', { class: 'alert alert-danger' });
    errorContainer.innerHTML = "Impossible de trouver la page demandée.<br>Toutes nos excuses pour la gêne occasionnée.";

    wrapper.appendChild(errorContainer);
}
