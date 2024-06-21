import Game from './class/game.js';
import { isAuth } from '@services/auth.js';
import Services from '@services';
import createElement from '@helpers/element.js';

export default async function initialize(wrapper) {
    if (localStorage.getItem('isPageUnloading') === 'true') {
        localStorage.removeItem('isPageUnloading');
        window.route.loadView("/");
        return;
    }

    const gameType = new URLSearchParams(window.location.search).get('type');
    
    if ((gameType == "1v1" || gameType == "tournament") && !await isAuth()) {
        window.route.loadView("/auth");
        return;
    }

    let game;
    const text = localStorage.getItem('PRODProfile');
    const login = text ? JSON.parse(text).login : "Anonymous";

    if (gameType == '1v1') {
        const loadingScreen = createElement('div', { class:"row", style:"display: flex; justify-content: center;" });

        const loadingGif = createElement('img', {
            src: 'img/home/loading.gif',
            style: 'width: 350px; height: 350px;'
        });
        const loadingText = createElement('div', { style:"color: white; display: flex; justify-content: center;", key:"waiting_game" });
        
        loadingScreen.appendChild(loadingGif);
        loadingScreen.appendChild(loadingText);
        wrapper.appendChild(loadingScreen);

        let gameID;
        const response = await Services.Game.get({ login, gametype: gameType });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('TEMPGameID', data.gameID);
            gameID = data.gameID;
            const token = localStorage.getItem('PRODLoginData');
            const webSocket = new WebSocket(`wss://localhost:6005/ws/game/${gameID}/?token=${token}`);

            webSocket.onopen = function() {};

            webSocket.onmessage = function(event) {
                const message = event.data;
                let objSocket = JSON.parse(message);

                if (objSocket.message === "ready") {
                    if (loadingScreen.parentNode)
                        loadingScreen.parentNode.removeChild(loadingScreen);

                    game = new Game(wrapper, gameType, gameID, login, objSocket.opponent, webSocket, objSocket.side);
                    game.setup();

                    window.addEventListener('popstate', () => {
                        if (game) game.stop();
                    });
                }
            };

            webSocket.onerror = function(error) {
                console.error("WebSocket error:", error);
                if (error.code === 1006) {
                    console.error("WebSocket connection closed abnormally.");
                    if (game) game.stop();
                    localStorage.removeItem('TEMPGameID');
                    window.route.loadView("/");
                }
            };

            webSocket.onclose = function(event) {
                if (event.wasClean) {
                    localStorage.removeItem('TEMPGameID');
                    if (game) game.stop();
                } else {
                    console.error("WebSocket connection closed unexpectedly:", event.reason);
                    if (game) game.stop();
                    localStorage.removeItem('TEMPGameID');
                    window.route.loadView("/");
                }
            };
        }
    } else if (gameType == 'tournament') {
        const tournamentDataString = localStorage.getItem('tournamentData');
        if (tournamentDataString) {
            const tournamentData = JSON.parse(tournamentDataString);
            const { tournamentId, login, gameData } = tournamentData;
            const gameID = gameData.gameID;
            const token = localStorage.getItem('PRODLoginData');
            const gameWebSocket = new WebSocket(`wss://localhost:6005/ws/tournamentgame/${tournamentId}${gameID}/?token=${token}`);

            gameWebSocket.onopen = function() {};

            gameWebSocket.onmessage = function(event) {
                const message = event.data;
                let objSocket;
                try {
                    objSocket = JSON.parse(message);
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                    return;
                }

                if (objSocket.message === "ready") {
                    game = new Game(wrapper, '1v1', gameID, login, objSocket.opponent, gameWebSocket, objSocket.side);
                    game.setup();
                    window.addEventListener('popstate', () => {
                        gameWebSocket.close();
                        if (game) game.stop();
                    });
                }
            };

            gameWebSocket.onerror = function(error) {
                console.error("Game WebSocket error:", error.message || error);
                if (game) game.stop();
                window.route.loadView("/");
            };

            gameWebSocket.onclose = function(event) {
                if (event.wasClean) {
                    if (game) game.stop();
                    window.route.loadView("/lobby");
                } else {
                    console.error("Game WebSocket connection closed unexpectedly:", event.reason);
                    if (game) game.stop();
                    window.route.loadView("/");
                }
            };
        }
    } else {
        if (gameType != "2v2")
            game = new Game(wrapper, gameType, null, "Player 2", "Player 1", null);
        else
            game = new Game(wrapper, gameType, null, "Team 1", "Team 2", null);
        game.setup();
        window.addEventListener('popstate', () => {
            if (game) game.stop();
        });
        window.addEventListener('beforeunload', () => {
            if (game) game.stop();
            localStorage.setItem('isPageUnloading', 'true');
        });
    }
}
