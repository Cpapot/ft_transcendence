import createCards from '@helpers/cards.js';
import { isAuth } from '@services/auth.js';

export default async function initialize(wrapper) {
    let data = [
        {path: '/training', footerText: 'training', imageUrl: '/img/home/TrainingPong.webp'}, 
        {path: '/multiplayer', footerText: 'multiplayer', imageUrl: '/img/home/MultiTest.webp', isLocked: !await isAuth()},
    ];

    createCards(wrapper, data);
}
