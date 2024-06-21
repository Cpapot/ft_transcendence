import createElement from '@helpers/element.js';
import Services from '@services';
import { handleTournamentWebSocket as handleWebSocket } from './websocketHelper.js';

export default function initialize(wrapper) {
    class Tournament {
        constructor(container) {
            this.container = container;
            this.tournaments = [];
    
            this.render();
        }
    
        render() {
            this.tab = createElement('div', {
                class: "card col-7 col-sm-7 col-md-7 tournament-tab container-fluid overflow-auto overflow-x-hidden text-center d-flex flex-column align-self-center",
                style: "width: 50vw; height: 80vh; max-height: 80vh;"
            });
            this.displayHeader();
            this.displayTournaments();
            this.container.appendChild(this.tab);
        }
    
        displayHeader() {
            const addCreaButton = createElement('button', {
                class: "create-tournament-button btn btn-success", 'key': 'create_button',
                style: "width: 5vw; height: 55px; font-size: 0.5vw;"
            });
    
            addCreaButton.addEventListener('click', () => {
                addCreaButton.classList.add('disabled');
                this.displayCreateTournamentForm();
            });
    
            const addRefreshButton = createElement('button', {
                class: "col-1 col-sm-1 col-md-1 bi-arrow-clockwise btn",
                style: "width: 58px; height: 58px; font-size: 1vw;"
            });
    
            addRefreshButton.addEventListener('click', () => {
                this.displayTournaments();
            });
    
            const headerRow = createElement('div', {
                class: "tournament-row row mb-2 border-bottom border-dark h4 d-flex justify-content-between align-items-center p-4"
            });
                
            const headerName = createElement('div', {
                class: "col-2 col-sm-2 col-md-2 flex-grow-1", 'key': 'tourn_name',
                style: "font-size: 1vw;"    
            });
    
            const headermaxPlayers = createElement('div', {
                class: "col-2 col-sm-2 col-md-2 flex-grow-1", 'key': 'tourn_max',
                style: "font-size: 1vw;"
            });
    
            const headermode = createElement('div', {
                class: "col-2 col-sm-2 col-md-2 flex-grow-1", 'key': 'tourn_mode',
                style: "font-size: 1vw;"
            });
    
            headerRow.appendChild(addRefreshButton);
            headerRow.appendChild(headerName);
            headerRow.appendChild(headermaxPlayers);
            headerRow.appendChild(headermode);
            headerRow.appendChild(addCreaButton);
            this.tab.appendChild(headerRow);
        }
    
        clearRows() {
            while (this.tab.children.length > 1)
                this.tab.removeChild(this.tab.lastChild);
        }
    
        async displayTournaments() {
            this.clearRows();
    
            const response = await Services.Tournament.all();
            if (response.ok) {
                this.tournaments = await response.json();
                this.tournaments.forEach(tournament => {
                    const temp = this.renderTournament(tournament);
                    this.tab.appendChild(temp);
                });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.response || "Unknown error occurred";
                this.displayError(errorMessage);
            }
        }
    
        async displayCreateTournamentForm() {
            const form = createElement('div', {
                class: "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark"
            });
        
            const addExitButton = createElement('button', {
                class: "bi-x-lg btn",
                style: "display: flex; width: 40px; height: 40px; font-size: 18px;"
            });
        
            const closeForm = () => {
                const addCreaButton = document.querySelector('.create-tournament-button');
                if (addCreaButton) {
                    addCreaButton.classList.remove('disabled');
                }
                form.remove();
            };
        
            addExitButton.addEventListener('click', closeForm);
            form.appendChild(addExitButton);
        
            const escHandler = (e) => {
                if (e.key === "Escape") {
                    closeForm();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        
            const nameLabel = createElement('label', {}, "Nom du tournoi:");
            const nameInput = createElement('input', {
                type: "text",
                id: "tournament-name",
                class: "form-control mb-3 border border-dark"
            });
            form.appendChild(nameLabel);
            form.appendChild(nameInput);
        
            const validateTournamentCharacters = (input) => {
                const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
                for (let char of input)
                    if (!allowedCharacters.includes(char))
                        return false;
                return true;
            };
        
            const updateSubmitButtonState = () => {
                const newName = nameInput.value.trim(); 
                const submitButton = form.querySelector('.create-tournament-button');
                if (submitButton) {
                    if (newName === '' || newName.length > 8 || !validateTournamentCharacters(newName)) {
                        submitButton.classList.add('disabled');
                    } else {
                        submitButton.classList.remove('disabled');
                    }
                }
            };
        
            updateSubmitButtonState();
        
            nameInput.addEventListener('input', updateSubmitButtonState);
        
            const modeLabel = createElement('label', {}, "Mode de jeu:");
            const modeSelect = createElement('select', {
                id: "game-mode",
                class: "form-select mb-3 border border-dark"
            });
            const soloOption = createElement('option', {});
            soloOption.innerHTML = window.route.getLocaleValue("solo");
        
            modeSelect.appendChild(soloOption);
        
            form.appendChild(modeLabel);
            form.appendChild(modeSelect);
        
            const submitButton = createElement('button', {
                class: "create-tournament-button btn btn-primary mb-3 disabled",
                style: "width: 5vw; height: 40px; font-size: 0.5vw;"
            });
            submitButton.innerHTML = window.route.getLocaleValue("submit_button");
        
            submitButton.addEventListener('click', async (event) => {
                event.preventDefault();
        
                const newName = nameInput.value.trim() || this.getNextTournamentName();
        
                let tournamentId;
                let text = localStorage.getItem('PRODProfile');
                let obj = JSON.parse(text);
                let login = obj.login;
                const response = await Services.Tournament.create({
                    name: newName
                });
                if (response.ok) {
                    const data = await response.json();
                    tournamentId = data.TournamentID;
        
                    const webSocket = await handleWebSocket(tournamentId, login);
        
                    this.tab.removeChild(form);
                    this.displayTournaments();
                } else {
                    this.tab.removeChild(form);
                    const errorData = await response.json();
                    const errorMessage = errorData.response || "unknown_error";
                    this.displayError(errorMessage);
                }
            });
        
            form.appendChild(submitButton);
            this.tab.appendChild(form);
        }
          
    
        displayError(message) {
            const form = createElement('div', {
                class: "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark",
            });
        
            const errorText = createElement('div', {
                class: "form-control mb-3 border border-dark",
            });
            errorText.innerHTML = window.route.getLocaleValue(message);
        
            const closeButton = createElement('button', {
                class: "btn btn-primary mb-3",
                style: "width: auto; height: auto; font-size: 1vw;",
            });
            closeButton.innerHTML = window.route.getLocaleValue("close");
        
            closeButton.addEventListener('click', () => {
                this.tab.removeChild(form);
            });
        
            form.appendChild(errorText);
            form.appendChild(closeButton);
        
            this.tab.appendChild(form);
        }
    
        renderTournament(tournament) {
            const row = createElement('div', {
                class: "row align-items-center mb-2 border-bottom border-dark h5 d-flex justify-content-between align-items-center p-4" });
    
            const addDeleteButton = createElement('button', {
                class: "col-1 col-sm-1 col-md-1 bi-x-lg btn",
                style: "width: 58px; height: 58px; font-size: 1vw;"
            });
            addDeleteButton.addEventListener('click', () => {
                row.remove();
            });
    
            const name = createElement('div', {
                class: "col-2 col-sm-2 col-md-1 flex-grow-1",
                style: "font-size: 1vw;"
            });
            name.textContent = tournament.name;
    
            const maxPlayers = createElement('div', {
                class: "col-2 col-sm-2 col-md-1 flex-grow-1",
                style: "font-size: 1vw;"
            });
            maxPlayers.textContent = `${tournament.playerCount}/8`;
    
            const mode = createElement('div', {
                class: "col-2 col-sm-2 col-md-1 flex-grow-1", 'key':'solo',
                style: "font-size: 1vw;"
            });
            mode.innerHTML = window.route.getLocaleValue("solo");
    
            row.appendChild(addDeleteButton);
            row.appendChild(name);
            row.appendChild(maxPlayers);
            row.appendChild(mode);
    
            const joinButton = createElement('button', {
                class: "join-tournament-button btn btn-primary",
                style: "width: 5vw; height: 55px; font-size: 0.5vw;"
            });
            joinButton.innerHTML = window.route.getLocaleValue("submit_button")
    
            joinButton.addEventListener('click', async () => {
                const TournamentID = tournament.tournamentID;
    
                let tournamentId;
                let text = localStorage.getItem('PRODProfile');
                let obj = JSON.parse(text);
                let login = obj.login;
                const response = await Services.Tournament.join({
                    TournamentID: TournamentID
                });
                if (response.ok) {
                    const data = await response.json();
                    tournamentId = data.TournamentID;
                    const webSocket = await handleWebSocket(tournamentId, login);
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.response || "Unknown error occurred";
                    this.displayError(errorMessage);
                }
            });
            row.appendChild(joinButton);
    
            return row;
        }
    }

    new Tournament(wrapper);
}