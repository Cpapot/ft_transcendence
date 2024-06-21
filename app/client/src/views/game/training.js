import createCards from '@helpers/cards.js';

export default function initialize(container) {
    const cardData = [
        {path: "/game?type=local", footerText: 'local', imageUrl: '/img/home/1v1.webp'},
        {path: "/game?type=ia", footerText: 'ia', imageUrl: '/img/home/1vAI.webp'},
        {path: '/game?type=2v2', footerText: 'duo', imageUrl: '/img/home/2v2.webp'},
    ];
    
    createCards(container, cardData);
}
