import createElement from '@helpers/element.js';
import { getCurrentRound, whichWinner, getWinners } from './lobbyUtils.js';

export default function initialize(wrapper) {
    class Lobby {
        constructor(container) {
            this.container = container;
            this.scoreBoard = null;
            this.round = getCurrentRound();
            if (this.round >= 1) {
                this.init();
            } else {
                this.initEmptyListBoard();
            }
        }
        
        init() {
            const tournamentRow = createElement('div', {
                class: "row",
                style: "display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center;"
            });
        
            this.createScoreBoard(tournamentRow);
            this.createTournamentTree(tournamentRow);
        
            this.container.appendChild(tournamentRow);
        }

        initEmptyListBoard() {
            this.listBoard = createElement('div', {
                class: "card tournament-tab container-fluid overflow-auto overflow-x-hidden text-center d-flex flex-column align-self-center",
                style: "width: 550px; height: 70vh; max-height: 70vh;",
                id: "listBoard"
            });
            this.container.appendChild(this.listBoard);
        }

        createScoreBoard(container) {
            this.scoreBoard = createElement('div', {
                class: "card tournament-tab container-fluid overflow-auto overflow-x-hidden text-center d-flex flex-column align-self-center d-lg-none",
                style: "width: 550px; height: 70vh; max-height: 70vh;",
                id: "scoreBoard"
            });

            let currentPlayers;
            let player;
            if (getCurrentRound() === 1) {
                currentPlayers = JSON.parse(localStorage.getItem('tournamentPlayers')) || [];
            } else if (getCurrentRound() >= 1) {
                currentPlayers = getWinners(getCurrentRound());
            }

            for (let i = 0; i < currentPlayers.length; i++) {
                if (currentPlayers) {
                    player = currentPlayers[i];
                }
                if (player) {
                    this.createScoreRow(player);
                }
            }

            container.appendChild(this.scoreBoard);
        }

        createScoreRow(player) {
            const row = createElement('div', {
                class: "row align-items-center mb-2 border border-dark h5 d-flex align-items-center p-3" });

            const playerName = createElement('div', {
                class: "col-2 col-sm-2 col-md-1 flex-grow-1",
                style: "margin-right: 0.5vw;"
            });

            let playerImg;
            if (player.login) {
                playerName.textContent = player.login;
                playerImg = createElement('img', {
                    class: "col-2 col-sm-2 col-md-1 rounded-circle",
                    style: "margin-left: 0.3vw; margin-top: 0.3vh; width: 50px; height: 30px;",
                    src: localStorage.getItem(player.login),
                    alt: "Avatar"
                });
            } else {
                playerName.textContent = player;
                playerImg = createElement('img', {
                    class: "col-2 col-sm-2 col-md-1 rounded-circle",
                    style: "margin-left: 0.3vw; margin-top: 0.3vh; width: 50px; height: 30px;",
                    src: localStorage.getItem(player),
                    alt: "Avatar"
                });
            }

            row.appendChild(playerImg);
            row.appendChild(playerName);
            this.scoreBoard.appendChild(row);
        }
        
        createPlayerBox(player, isWinner) {
            const backgroundColor = isWinner === null ? '' : (isWinner ? '#28a745' : '#dc3545');
            const playerBox = createElement('div', {
                class: "border border-dark",
                style: `width: 330px; height: 50px; display: flex; align-items: center; justify-content: center; background-color: ${backgroundColor};`
            });
        
            const playerName = createElement('div', {
                class: "col-8 flex-grow-1",
                style: "font-size: 20px; margin-left: 10px;"
            });
        
            let playerImg;
            if (player.login) {
                playerName.textContent = player.login;
                playerImg = createElement('img', {
                    class: "col-2 col-sm-2 col-md-1 rounded-circle",
                    style: "margin-left: 0.3vw; margin-top: 0.3vh; width: 30px; height: 25px;",
                    src: localStorage.getItem(player.login),
                    alt: "Avatar"
                });
            } else {
                playerName.textContent = player;
                playerImg = createElement('img', {
                    class: "col-2 col-sm-2 col-md-1 rounded-circle",
                    style: "margin-left: 0.3vw; margin-top: 0.3vh; width: 30px; height: 25px;",
                    src: localStorage.getItem(player),
                    alt: "Avatar"
                });
            }
        
            playerBox.appendChild(playerImg);
            playerBox.appendChild(playerName);
            return playerBox;
        }
        
        createMatchRow(container, player1, player2, winner) {
            const matchBox = createElement('div', {
                class: "card border border-dark",
                style: "width: 330px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px;"
            });
        
            const isPlayer1Winner = winner === player1;
            const isPlayer2Winner = winner === player2;
            matchBox.appendChild(this.createPlayerBox(player1, winner ? isPlayer1Winner : null));
            matchBox.appendChild(this.createPlayerBox(player2, winner ? isPlayer2Winner : null));
        
            container.appendChild(matchBox);
        }
                  
        createEmptyMatchRow(container) {
            const emptyMatch = createElement('div', {
                class: "card border border-dark",
                style: "width: 330px; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;"
            });
            container.appendChild(emptyMatch);
        }

        createMatchs(container, bootstrap, style, round) {
            const matchs = createElement('div', { class: bootstrap, style: style });
            let currentPlayers;
            let player1;
            let player2;
        
            if (round === 1) {
                currentPlayers = JSON.parse(localStorage.getItem('tournamentPlayers')) || [];
            } else if ((round >= 2 && getCurrentRound() >= 1) || (round >= 3 && getCurrentRound() >= 2) || (round >= 3 && getCurrentRound >= 3)) {
                currentPlayers = getWinners(round);
            }
        
            const matchesCount = round === 1 ? 4 : (round === 2 ? 2 : 1);
            for (let i = 0; i < matchesCount; i++) {
                if (currentPlayers) {
                    player1 = currentPlayers[i * 2];
                    player2 = currentPlayers[i * 2 + 1];
                }
                if (player1 && player2) {
                    if (getCurrentRound() > round) {
                        const winner = whichWinner(player1, player2, round);
                        this.createMatchRow(matchs, player1, player2, winner);
                    } else {
                        this.createMatchRow(matchs, player1, player2, null);
                    }
                }  else {
                    this.createEmptyMatchRow(matchs);
                }
            }
        
            container.appendChild(matchs);
        } 
        
        createTournamentTree(container) {
            const treeContainer = createElement('div', {
                class: "col-md-12 d-none d-lg-block",
                style: "margin-left: 45px;",
                id: "treeContainer"
            });
        
            const treeRow = createElement('div', {
                class: "row justify-content-between"
            });
        
            const round1 = createElement('div', { class: "col-md-4" });
            this.createMatchs(round1, "col-md-12 mb-4", "", 1);
            treeRow.appendChild(round1);
        
            const round2 = createElement('div', {
                class: "col-md-4",
                style: "padding-top: 120px"
            });
            this.createMatchs(round2, "col-md-12 mb-4", "padding-bottom: 85px;", 2);
            treeRow.appendChild(round2);
        
            const round3 = createElement('div', { class: "col-md-4" });
            this.createMatchs(round3, "col-md-12 mb-4", "padding-top: 180px;", 3);
            treeRow.appendChild(round3);
        
            treeContainer.appendChild(treeRow);
            container.appendChild(treeContainer);
        }     
    }
    new Lobby(wrapper);
}

