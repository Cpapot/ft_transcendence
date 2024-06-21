import THREE from '../export.js'

export default class Ball {
    constructor(scene, objects, currentArena) {
        this.scene = scene;
        this.objects = objects;
        this.currentArena = currentArena;
        this.ballSpeed = 6;
		this.initialDirection = new THREE.Vector2(1, 0);
        this.direction = this.initialDirection.clone();
		this.isAnimationStarted = false;
    }

    createBall() {
        const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(ballGeometry, ballMaterial);
        this.scene.add(this.mesh);
        this.mesh.position.set(0, 0, 0.3);

        this.objects.push(this.mesh);
    }

    moveBall(deltaTime) {
        if (this.currentArena && this.currentArena.gameStart) {
            const speedPerSecond = this.ballSpeed * deltaTime;

            this.mesh.position.x += this.direction.x * speedPerSecond;
            this.mesh.position.y += this.direction.y * speedPerSecond;

            const ballRadius = 0.1;
            const wallTop = 3.5 - ballRadius;
            const wallBottom = -3.5 + ballRadius;

            if (this.mesh.position.y > wallTop) {
                this.mesh.position.y = wallTop;
                this.direction.y = -Math.abs(this.direction.y);
            } else if (this.mesh.position.y < wallBottom) {
                this.mesh.position.y = wallBottom;
                this.direction.y = Math.abs(this.direction.y);
            }

            if (this.currentArena.players) {
                this.currentArena.players.forEach(player => {
                    if (player && player.mesh) {
                        const playerWidth = 0.7;
                        const playerHeight = 1.8;
                        const ballRadius = 0.1;

                        if (this.mesh.position.x + ballRadius >= player.mesh.position.x - playerWidth / 2 &&
                            this.mesh.position.x - ballRadius <= player.mesh.position.x + playerWidth / 2 &&
                            this.mesh.position.y + ballRadius >= player.mesh.position.y - (playerHeight + 0.5) / 2 &&
                            this.mesh.position.y - ballRadius <= player.mesh.position.y + (playerHeight - 1.2) / 2) {

                            this.direction.x = -this.direction.x;

                            const relativeIntersectY = (this.mesh.position.y - player.mesh.position.y) / (playerHeight / 2);

                            this.direction.y = relativeIntersectY * 1.0;
                        }
                    }
                });
            }

            if (this.mesh.position.x < -9.1 + 0.9) {
                this.goalScored(this.currentArena.login, this.currentArena.side);
            }
            if (this.mesh.position.x > 9.1 - 0.9) {
                this.goalScored(this.currentArena.opponentLogin, this.currentArena.side);
            }
        }
    }

    goalScored(winner, side) {
        this.mesh.position.set(0, 0, 0.3);
        this.resetDirection();
        if (side === 'left' || winner == "Team 2" || winner == "Player 1") {
            this.direction.x = -1;
            this.currentArena.scorePlayer1++;
            this.currentArena.createScore(-this.currentArena.scorePlayer1);
        } else if (side === 'right' || winner == "Team 1" || winner == "Player 2") {
            this.direction.x = 1;
            this.currentArena.scorePlayer2++;
            this.currentArena.createScore(this.currentArena.scorePlayer2);
        }

        if (this.currentArena.scorePlayer1 == 5 || this.currentArena.scorePlayer2 == 5) {
            this.currentArena.gameStart = false;
            this.mesh.position.set(0, 0, 0.3);
            this.currentArena.winner = winner;
            this.currentArena.createEndPopup(winner);
        }
    }

    resetDirection() {
        this.direction.copy(this.initialDirection);
    }
}
