import createElement from '@helpers/element.js';
import Arena from './arena.js';
import THREE from '../export.js';

export default class Game {
    constructor(container, gameType, gameID, login, opponentLogin, webSocket, side) {
        this.gameID = gameID;
        this.container = container;
        this.gameType = gameType;
        this.gameDisplay = null;
        this.userName = login;
        this.opponentName = opponentLogin;
        this.webSocket = webSocket;
        this.side = side;
        this.currentArena = null;
        this.currentCamera = null;
        this.player1 = null;
        this.player2 = null;
        this.player3 = null;
        this.player4 = null;
        this.previousTime = performance.now();
        this.scene = null;
        this.renderer = null;
        this.renderLoop = null;
        this.objects = [];
    }

    createGameDisplay() {
        this.gameDisplay = createElement('div', { class: "row", style: "display: flex; justify-content: center; flex-direction: column;" });
        this.container.appendChild(this.gameDisplay);
    }

    createNameBar() {
        const nameBar = createElement('div', {
            class: "row",
            style: "display: flex; align-items: center; justify-content: space-between; padding-bottom: 50px;"
        });
        const firstNameContainer = createElement('div', {
            class: "col",
            style: "color: #FFF;"
        });
        firstNameContainer.textContent = this.userName;

        const secondNameContainer = createElement('div', {
            class: "col",
            style: "color: #FFF;"
        });
        secondNameContainer.textContent = this.opponentName ? this.opponentName : this.userName;
        if (this.side === 'left') {
            nameBar.appendChild(firstNameContainer);
            nameBar.appendChild(secondNameContainer);
        } else {
            nameBar.appendChild(secondNameContainer);
            nameBar.appendChild(firstNameContainer);
        }
        if (this.side === 'left') {
            firstNameContainer.style.textAlign = 'left';
            secondNameContainer.style.textAlign = 'right';
        } else {
            firstNameContainer.style.textAlign = 'right';
            secondNameContainer.style.textAlign = 'left';
        }
        this.gameDisplay.appendChild(nameBar);
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

        this.rendererWidthPercentage = 80;
        this.rendererHeightPercentage = 80;
        this.rendererWidth = (window.innerWidth / 100) * this.rendererWidthPercentage;
        this.rendererHeight = (window.innerHeight / 100) * this.rendererHeightPercentage;
        this.renderer.setSize(this.rendererWidth, this.rendererHeight);
        this.gameContent.appendChild(this.renderer.domElement);
    }

    async setup() {
        this.createGameDisplay();
        this.createNameBar();
        this.gameContent = createElement('div', { class: "row" });
        this.gameDisplay.appendChild(this.gameContent);

        this.createScene();

        this.currentArena = new Arena(this.scene, this.objects, this.gameType, this.previousTime, this.webSocket, this.side, this.userName, this.opponentName);
        this.currentArena.create();

        const onWindowResize = () => {
            const newRendererWidth = (window.innerWidth / 100) * this.rendererWidthPercentage;
            const newRendererHeight = (window.innerHeight / 100) * this.rendererHeightPercentage;
            this.currentArena.cameras.forEach(camera => {
                camera.aspect = newRendererWidth / newRendererHeight;
                camera.updateProjectionMatrix();
            });
            this.renderer.setSize(newRendererWidth, newRendererHeight);
        };
        window.addEventListener('resize', onWindowResize, false);

        this.currentCamera = this.currentArena.cameras[this.currentArena.currentCameraIndex];
        [this.player1, this.player2, this.player3, this.player4] = this.currentArena.players;

        await this.render();
    }

    async render() {
        let lastRenderTime = 0;
        const targetFPS = 37;
        const targetFrameTime = 1000 / targetFPS;

        this.renderLoop = async (currentTime) => {
            const deltaTime = currentTime - lastRenderTime;

            if (deltaTime >= targetFrameTime) {
                lastRenderTime = currentTime;

                await this.updateGameState(currentTime);
                this.updatePlayerPositions();
                this.updateCameras();
                this.renderScene();

                this.animationId = requestAnimationFrame(this.renderLoop.bind(this));
            } else {
                setTimeout(() => {
                    this.animationId = requestAnimationFrame(this.renderLoop.bind(this));
                }, targetFrameTime - deltaTime);
            }
        };

        this.animationId = requestAnimationFrame(this.renderLoop.bind(this));
    }

    async updateGameState(currentTime) {
        if ((this.gameType == "1v1" || this.gameType == "tournment") && this.gameID != null) {
            this.webSocket.onmessage = (event) => {
                const message = event.data;
                let objSocket = JSON.parse(message);

                if (objSocket.message == "gamefinish") {
                    this.currentArena.gameStart = false;
                    this.currentArena.ball.mesh.position.set(0, 0, 0.3);
                    this.currentArena.createEndPopup(objSocket.winner);
                } else if (this.player1.mesh) {
                    if (this.side == "right") {
                        this.player1.mesh.position.y = objSocket.opponentY;
                        if (this.currentArena.scorePlayer1 < objSocket.leftScore) {
                            this.currentArena.scorePlayer1 = objSocket.leftScore;
                            this.currentArena.createScore(-this.currentArena.scorePlayer1);
                        }
                        if (this.currentArena.scorePlayer2 < objSocket.rightScore) {
                            this.currentArena.scorePlayer2 = objSocket.rightScore;
                            this.currentArena.createScore(this.currentArena.scorePlayer2);
                        }
                    } else {
                        this.player2.mesh.position.y = objSocket.opponentY;
                        if (this.currentArena.scorePlayer1 < objSocket.leftScore) {
                            this.currentArena.scorePlayer1 = objSocket.leftScore;
                            this.currentArena.createScore(-this.currentArena.scorePlayer1);
                        }
                        if (this.currentArena.scorePlayer2 < objSocket.rightScore) {
                            this.currentArena.scorePlayer2 = objSocket.rightScore;
                            this.currentArena.createScore(this.currentArena.scorePlayer2);
                        } 
                    }
                    this.currentArena.ball.mesh.position.x = objSocket.ballX;
                    this.currentArena.ball.mesh.position.y = objSocket.ballY;
                }
            };
        }

        if (this.currentArena.gameStart && this.gameType != "1v1") {
            const ballDeltaTime = (currentTime - this.previousTime) / 1000;
            this.previousTime = currentTime;
            this.currentArena.ball.moveBall(ballDeltaTime);
        }
    }

    updatePlayerPositions() {
        if (!this.side) {
            this.player1.updatePosition(this.gameType == "2v2" ? [this.player2] : null);
            if (this.gameType != "ia")
                this.player2.updatePosition(this.gameType == "2v2" ? [this.player1] : null);
            else
                this.player2.updateIAPosition();
    
            if (this.gameType == "2v2") {
                this.player3.updatePosition([this.player4]);
                this.player4.updatePosition([this.player3]);
            }
        } else if (this.side == "left") {
            this.player1.updatePosition(this.gameType == "2v2" ? [this.player2] : null);
        } else if (this.side == "right") {
            this.player2.updatePosition(this.gameType == "2v2" ? [this.player1] : null);
        }
    }

    updateCameras() {
        this.updateCameraPosition(this.player1);
        if (this.gameType == "2v2") {
            this.updateCameraPosition(this.player2, true);
            this.updateCameraPosition(this.player3, true);
            this.updateCameraPosition(this.player4, true);
        } else if (this.player2) {
            this.updateCameraPosition(this.player2, false, true);
        }
    }

    updateCameraPosition(player, rotateZ = false, invert = false) {
        if (player && player.mesh && player.camera) {
            const offset = invert ? 3 : -3;
            player.camera.position.set(player.mesh.position.x + offset, player.mesh.position.y, 2);
            player.camera.lookAt(player.mesh.position.x, player.mesh.position.y, invert ? 1 : 3);
            player.camera.rotation.x = -Math.PI / 6000;
            player.camera.rotation.z = invert ? Math.PI / 2 : -Math.PI / 2;
        }
    }

    renderScene() {
        this.currentCamera = this.currentArena.cameras[this.currentArena.currentCameraIndex];
        this.renderer.render(this.currentArena.scene, this.currentCamera);
    }

    stop() {
        if (this.webSocket)
            this.webSocket.close();
        if (this.currentArena)
            this.currentArena.gameStart = false;
    
        this.objects.forEach(object => {
            this.scene.remove(object);
        });
        this.objects = [];
        if (this.currentArena)
            this.currentArena.stopCameraAnimation();

        window.removeEventListener('keydown', this.currentArena.boundHandleKeyDown);
        window.removeEventListener('keyup', this.currentArena.boundHandleKeyUp);
        cancelAnimationFrame(this.animationId);
        this.renderer.dispose();
        this.scene.remove();
        if (this.gameDisplay) {
            this.gameDisplay.remove();
        }
    }
}
