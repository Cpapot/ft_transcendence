import createElement from './element.js';

export default function createCards(wrapper, cardData) {
    cardData.forEach(data => {
        const cardContainer = createElement('a', { 
            class: "card card-hover m-4 text-center active text-decoration-none",
            style: `width: 20vw; height: 50vh; position: relative; overflow: hidden; background-image: url('${data.imageUrl}'); background-size: cover; background-position: center;`
        });

        const cardContent = createElement('div', { 
            class: 'card-body d-flex flex-column justify-content-center',
            style: 'pointer-events: none;'
        });

        const cardFooter = createElement('div', { class: 'card-footer bg-dark text-white', style: 'pointer-events: none;' });
        const cardText = createElement('p', { class: 'card-text fs-5', 'key': data.footerText });
        cardFooter.appendChild(cardText);

        if (data.isLocked) {
            const lockIcon = createElement('i', { class: 'text-white bi bi-person-fill-lock fs-1 mb-2' });
            const loginMessage = createElement('p', { class: 'text-white mb-0', 'key': 'login_required' });
            cardContent.appendChild(lockIcon);
            cardContent.appendChild(loginMessage);
            
            const overlay = createElement('div', { 
                class: 'overlay',
                style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.5);',
            });
            cardContainer.appendChild(overlay);
        }
        
        cardContainer.appendChild(cardContent);
        cardContainer.appendChild(cardFooter);

        cardContainer.addEventListener('click', () => {
            window.route.loadView(data.path);
        });
        wrapper.appendChild(cardContainer);
    });
}
