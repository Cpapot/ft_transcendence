import THREE from '../export.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Player {
    constructor(positionX, positionY, scene, color, currentArena, objects, webSocket) {
        this.objects = objects;
        this.positionX = positionX;
        this.positionY = positionY;
        this.scene = scene;
        this.color = color;
        this.currentArena = currentArena;
        this.webSocket = webSocket;
        this.createMesh();
        if (this.currentArena.gameType != "2v2")
            this.createCamera();
        this.position = new THREE.Vector3(positionX, positionY, 0);
        this.moveLeft = false;
        this.moveRight = false;
        this.lastPredictionTime = 0;
        this.predictionInterval = 1000;
        this.playerSpeed = 5;
        this.lastUpdateTime = Date.now();
    }

    createMesh() {
        const loader = new GLTFLoader();
        loader.load(
            './models/player.gltf',
            (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        const material = new THREE.MeshBasicMaterial({ color: this.color });
                        child.material = material;
                    }
                });
                this.mesh = gltf.scene;
                this.scene.add(this.mesh);
                const scaleFactor = 0.008;
                this.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
                this.mesh.position.set(this.positionX, this.positionY, 0);
                this.mesh.position.z = -0.3;
                this.mesh.rotateY(Math.PI / 2);
                this.mesh.rotateZ(Math.PI / 1.5);

                this.objects.push(this.mesh);
            }, ( xhr ) => {}, ( error ) => {}
        );
    }
    
    updatePositionTeam(players) {
        let shouldMoveLeft = true;
        let shouldMoveRight = true;
        
        for (const player of players) {
            if (player !== this && player.mesh) {
                if (Math.abs(this.mesh.position.y - player.mesh.position.y) < 1.02) {
                    if (this.mesh.position.y < player.mesh.position.y) {
                        shouldMoveLeft = false;
                    } else {
                        shouldMoveRight = false;
                    }
                }
            }
        }
        if (this.moveLeft && shouldMoveLeft && this.mesh.position.y < 2.90) {
            this.mesh.position.y += 0.15;
        }
        if (this.moveRight && shouldMoveRight && this.mesh.position.y > -2.20) {
            this.mesh.position.y -= 0.15;
        }
    }
    
    updatePosition(isDUOPlayers) {
        if (isDUOPlayers) {
            this.updatePositionTeam(isDUOPlayers);
            return;
        }

        if (this.moveLeft && this.mesh.position.y < 2.90) {
            this.mesh.position.y += 0.15;
        }
        if (this.moveRight && this.mesh.position.y > -2.20) {
            this.mesh.position.y -= 0.15;
        }
        if (this.webSocket && (this.moveRight || this.moveLeft) && this.mesh.position.y) {
            this.webSocket.send(JSON.stringify({ playerY: this.mesh.position.y.toString() }));
        }        
    }

    predictedBallPosition() {
        if (this.currentArena.gameStart == false) return;

        const targetX = 8.5;
        const ballPositionX = this.currentArena.ball.mesh.position.x;
        const ballPositionY = this.currentArena.ball.mesh.position.y;

        const speedX = this.currentArena.ball.direction.x * this.currentArena.ball.ballSpeed;

        const distanceToTargetX = targetX - ballPositionX;
        const timeToReachX = Math.abs(distanceToTargetX / speedX);

        let predictedY = ballPositionY + (this.currentArena.ball.direction.y * this.currentArena.ball.ballSpeed * timeToReachX);

        const wallTop = 3.5;
        const wallBottom = -3.5;

        while (predictedY > wallTop || predictedY < wallBottom) {
            if (predictedY > wallTop) {
                predictedY = wallTop - (predictedY - wallTop);
            } else if (predictedY < wallBottom) {
                predictedY = wallBottom + (wallBottom - predictedY);
            }
        }

        this.predictedBallY = predictedY;
    }

    updateIAPosition() {
        if (this.currentArena.gameStart == false) return;

        const currentTime = performance.now();

        if (this.currentArena && this.currentArena.ball && this.currentArena.ball.mesh) {
            if (currentTime - this.lastPredictionTime >= this.predictionInterval) {
                this.predictedBallPosition();
                this.lastPredictionTime = currentTime;
            }

            if (this.mesh) {
                if (this.predictedBallY > (this.mesh.position.y) && this.mesh.position.y < 3.5) {
                    this.moveLeft = true;
                    this.currentArena.simulateKeyEvent("ArrowLeft", 'keydown');
                    if (this.moveLeft) {
                        this.mesh.position.y += 0.15;
                    }
                    if (this.mesh.position.y >= this.predictedBallY)
                        this.currentArena.simulateKeyEvent("ArrowLeft", 'keyup');
                } else if (this.predictedBallY < (this.mesh.position.y - 0.25) && this.mesh.position.y > -2.87) {
                    this.moveRight = true;
                    this.currentArena.simulateKeyEvent("ArrowRight", 'keydown');
                    if (this.moveRight) {
                        this.mesh.position.y -= 0.15;
                    }
                    if (this.mesh.position.y <= this.predictedBallY)
                        this.currentArena.simulateKeyEvent("ArrowRight", 'keyup');
                }

                if (this.mesh.position.y > 2.90) {
                    this.mesh.position.y = 2.90;
                } else if (this.mesh.position.y < -2.20) {
                    this.mesh.position.y = -2.20;
                }
            }
        }
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(this.positionX, this.positionY, 1.5);
        this.scene.add(this.camera);
        this.currentArena.setCameras(this.camera);
    }
};
