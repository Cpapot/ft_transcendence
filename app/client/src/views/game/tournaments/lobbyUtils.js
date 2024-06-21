import createElement from '@helpers/element.js';

export let addedKeys = [];
export function storeGamesByRound(gamesData) {
    const winningGames = gamesData.filter(game => game.winner);
    const winnersCount = winningGames.length;

    let tab = {
        'end': 1,
        'final': 2,
        'semi_final': 4,
        'quarter_final': 8
    }

    let currentRound;
    for (let key in tab)
        if (tab[key] == winnersCount)
            currentRound = key;

    localStorage.setItem(`tournamentGames_${currentRound}`, JSON.stringify(winningGames));
    addedKeys.push(`tournamentGames_${currentRound}`);
}

export function addPlayer(gameData) {
    const listBoard = document.getElementById('listBoard');
    console.log(listBoard);

    if (listBoard) {
        gameData.forEach(player => {
            const row = createElement('div', {
                class: "row align-items-center mb-2 border border-dark h5 d-flex align-items-center p-3",
                id: `player-${player.login}`
            });
    
            const playerImg = createElement('img', {
                class: "col-2 col-sm-2 col-md-1 rounded-circle",
                style: "margin-left: 0.3vw; margin-top: 0.3vh; width: 55px; height: 30px;",
                src: player.avatar,
                alt: "Avatar"
            });
    
            localStorage.setItem(player.login, player.avatar);
            addedKeys.push(player.login);
    
            const playerName = createElement('div', {
                class: "col-2 col-sm-2 col-md-1 flex-grow-1",
                style: "margin-right: 0.5vw;"
            });
            playerName.textContent = player.login;
    
            row.appendChild(playerImg);
            row.appendChild(playerName);
            listBoard.appendChild(row);
        });
    }
}

export function newPlayer(gameData) {
    const listBoard = document.getElementById('listBoard');
    const row = createElement('div', {
        class: "row align-items-center mb-2 border border-dark h5 d-flex align-items-center p-3",
        id: `player-${gameData.NewPlayer}`
    });
    
    const playerImg = createElement('img', {
        class: "col-2 col-sm-2 col-md-1 rounded-circle",
        style: "margin-left: 0.3vw; margin-top: 0.3vh; width: 55px; height: 30px; ",
        src: gameData.avatar,
        alt: "Avatar"
    });

    localStorage.setItem(gameData.NewPlayer, gameData.avatar);
    addedKeys.push(gameData.NewPlayer);
    
    const playerName = createElement('div', {
        class: "col-2 col-sm-2 col-md-1 flex-grow-1",
        style: "margin-right: 0.5vw;"
    });
    playerName.textContent = gameData.NewPlayer;
    
    row.appendChild(playerImg);
    row.appendChild(playerName);
    listBoard.appendChild(row);
}

export function removePlayer(gameData) {
    const playerRow = document.getElementById(`player-${gameData.DisconnectedPlayer}`);
    if (playerRow) {
        playerRow.remove();
    }
}

export function clearLocales() {
    localStorage.removeItem('tournamentPlayers');
    localStorage.removeItem('tournamentGames');
    localStorage.removeItem('currentRound');
    localStorage.removeItem('tournamentData');
    addedKeys.forEach(key => {
        localStorage.removeItem(key);
    });
}

export function getCurrentRound() {
    const round = localStorage.getItem('currentRound');
    switch(round) {
        case 'end':
            return 4;
        case 'final':
            return 3;
        case 'round 2':
            return 2;
        case 'round 1':
            return 1;
        case'round 0':
        default:
            return 0;
    }
}

export function whichWinner(player1, player2, round) {
    let roundKey;
    const currentRound = getCurrentRound();
    
    if (currentRound >= 2 && round === 1) {
        roundKey = 'semi_final';
    } else if (currentRound >= 3 && round === 2) {
        roundKey = 'final';
    } else if (currentRound === 4 && round === 3) {
        roundKey = 'end';
    }

    const gamesData = JSON.parse(localStorage.getItem(`tournamentGames_${roundKey}`)) || [];

    for (let game of gamesData) {
        if (game.winner === player1.login || game.winner === player1) {
            return player1;
        } else if (game.winner === player2.login || game.winner === player2) {
            return player2;
        }
    }
    return null;
}

export function getWinners(round) {
    let roundKey;
    const currentRound = getCurrentRound();
    if (currentRound >= 2 && round == 2) {
        roundKey = 'semi_final';
    } else if (currentRound == 3 && round == 3) {
        roundKey = 'final';
    } else if (currentRound == 4 && round == 3) {
        roundKey = 'final';
    }
    const winnersData = JSON.parse(localStorage.getItem(`tournamentGames_${roundKey}`)) || [];
    
    const winners = winnersData.map(game => game.winner || null);
    
    return winners;
}

export function createWinPopup(winner, tournamentWebSocket) {
    const wrapper = document.getElementById('main');

    const form = document.createElement('div');
    form.className = "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark text-center";
    form.style = "min-width: 300px;";
    
    const message = document.createElement('div');
    message.className = "form-control mb-3 border border-dark";
    message.innerHTML = window.route.getLocaleValue("victory");
    message.textContent = `${winner} ` + message.textContent;
    
    const closeButton = document.createElement('button');
    closeButton.className = "btn btn-primary";
    closeButton.innerHTML = window.route.getLocaleValue("close");
    closeButton.addEventListener('click', () => {
        wrapper.removeChild(form);
        tournamentWebSocket.close();
    });

    form.appendChild(message);
    form.appendChild(closeButton);

    wrapper.appendChild(form);
}

export function createLoosePopup(tournamentWebSocket) {
    const wrapper = document.getElementById('main');

    const form = document.createElement('div');
    form.className = "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark text-center";
    form.style = "min-width: 300px;";
    
    const message = document.createElement('div');
    message.className = "form-control mb-3 border border-dark"; 
    message.innerHTML = window.route.getLocaleValue("loose");
    
    const closeButton = document.createElement('button');
    closeButton.className = "btn btn-primary";
    closeButton.innerHTML = window.route.getLocaleValue("close");
    closeButton.addEventListener('click', () => {
        wrapper.removeChild(form);
        tournamentWebSocket.close();
    });

    form.appendChild(message);
    form.appendChild(closeButton);

    wrapper.appendChild(form);
}

export function createCancelPopup(tournamentWebSocket) {
    const wrapper = document.getElementById('main');

    const form = document.createElement('div');
    form.className = "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark text-center";
    form.style = "min-width: 300px;";
    
    const message = document.createElement('div');
    message.className = "form-control mb-3 border border-dark"; 
    message.innerHTML = window.route.getLocaleValue("too_much_disco");
    
    const closeButton = document.createElement('button');
    closeButton.className = "btn btn-primary";
    message.innerHTML = window.route.getLocaleValue("close");
    closeButton.addEventListener('click', () => {
        wrapper.removeChild(form);
        tournamentWebSocket.close();
    });

    form.appendChild(message);
    form.appendChild(closeButton);

    wrapper.appendChild(form);
}