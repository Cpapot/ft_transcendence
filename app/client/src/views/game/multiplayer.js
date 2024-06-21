import createCards from '@helpers/cards.js';

export default function initialize(wrapper) {
    let data = [
        {path: '/game?type=1v1', footerText: 'solo', imageUrl: '/img/home/online.webp'},
        {path: '/tournament', footerText: 'tournament', imageUrl: '/img/home/tournament.webp'},
    ];

    createCards(wrapper, data);
}
