import { addPlayer, newPlayer, removePlayer, storeGamesByRound, clearLocales, createWinPopup, createLoosePopup, createCancelPopup } from './lobbyUtils.js';

export async function handleTournamentWebSocket(tournamentId, login) {
    const token = localStorage.getItem('PRODLoginData');
    const tournamentWebSocket = new WebSocket(`wss://localhost:6005/ws/tournament/${tournamentId}/?token=${token}`);

    window.addEventListener('popstate', () => {
        tournamentWebSocket.close();
    });

    window.addEventListener('beforeunload', () => {
        tournamentWebSocket.close();
    });

    tournamentWebSocket.onopen = function() {
        window.route.loadView("/lobby");
    };

    tournamentWebSocket.onmessage = async function(event) {
        const message = event.data;
        const gamesData = JSON.parse(message);

        if (Array.isArray(gamesData) && gamesData.length > 0) {
            if (gamesData[0].hasOwnProperty('login') && gamesData[0].hasOwnProperty('seed')) {
                localStorage.setItem('tournamentPlayers', JSON.stringify(gamesData));
                localStorage.setItem('currentRound', 'round 1');
            } else if (gamesData[0].hasOwnProperty('login') && gamesData[0].hasOwnProperty('avatar')) {
                addPlayer(gamesData);                    
            } else if (gamesData[0].gameID && (gamesData[0].player1 || gamesData[0].player2)) {
                localStorage.setItem('tournamentGames', JSON.stringify(gamesData));

                await handleGameWebSockets(tournamentId, login, gamesData);
            } else if (gamesData[0].gameID && gamesData[0].winner) {
                storeGamesByRound(gamesData);
                const winningGames = gamesData.filter(game => game.winner);
                const winnersCount = winningGames.length;

                let currentRound;
                if (winnersCount == 1) {
                    currentRound = 'end';
                } if (winnersCount == 2) {
                    currentRound = 'final';
                } else if (winnersCount == 4) {
                    currentRound = 'round 2';
                } else if (winnersCount == 8) {
                    currentRound = 'round 1';
                }

                localStorage.setItem('currentRound', currentRound);

                const winningGame = winningGames.find(game => game.winner === login);
                if (winningGame && currentRound == 'end') {
                    window.route.loadView("/lobby");
                    createWinPopup(login, tournamentWebSocket);
                } else if (winningGame) {
                    window.route.loadView("/lobby");
                } else {
                    createLoosePopup(tournamentWebSocket);
                }
            }
        } else if (gamesData.NewPlayer) {
            newPlayer(gamesData);
        } else if (gamesData.DisconnectedPlayer) {
            removePlayer(gamesData);
        } else if (gamesData.finish) {
            createCancelPopup(tournamentWebSocket);
        }
    };

    tournamentWebSocket.onerror = function(error) {
        console.error("Tournament WebSocket error:", error.message || error);
        clearLocales();
        window.route.loadView("/");
    };

    tournamentWebSocket.onclose = function(event) {
        if (event.wasClean) {
            clearLocales();
            window.route.loadView("/");
        } else {
            console.error("Tournament WebSocket connection closed unexpectedly:", event.reason);
            clearLocales();
            window.route.loadView("/");
        }
    };

    return tournamentWebSocket;
}

export async function handleGameWebSockets(tournamentId, login, gamesData) {
    for (let gameData of gamesData) {
        if (gameData.gameID) {
            if (gameData.player1 === login || gameData.player2 === login) {
                const tournamentData = {
                    tournamentId: tournamentId,
                    login: login,
                    gameData: gameData
                };
                localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
                window.route.loadView("/game?type=tournament");
            }
        }
    }
}