import createElement from '@helpers/element.js';
import THREE from '../export.js'
import Player from './players.js';
import Ball from './ball.js';
import keyMappingsLocal from '../controllers/keyMappingsLocal.js';
import keyMappingsOnline from '../controllers/keyMappingsOnline.js';

export default class Arena {
    constructor(scene, objects, gameType, previousTime, webSocket, side, login, opponentLogin) {
        this.scene = scene;
        this.objects = objects;
        this.gameType = gameType;
        this.webSocket = webSocket;
        this.side = side;
        this.login = login;
        this.opponentLogin = opponentLogin;
        this.playerIndex = this.side == "left" ? 0 : 1;
        this.cameraAnimationId = null;
        this.players = [];
        this.currentCameraIndex = 0;
        this.cameras = [];
        this.ball = null;
        this.gameStart = false;
        this.textPlayer1 = null;
        this.textPlayer2 = null;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
        this.boundHandleKeyUp = this.handleKeyUp.bind(this);
        window.addEventListener('keydown', this.boundHandleKeyDown);
        window.addEventListener('keyup', this.boundHandleKeyUp);
        this.winner = null;
		this.animationIsFinish = false;
		this.previousTime = previousTime;
    }

    simulateKeyEvent(key, eventType) {
        var event = new KeyboardEvent(eventType, { key: key });
        window.dispatchEvent(event);

        if (eventType == 'keydown')
            this.handleKeyDown(event);
        else if (eventType == 'keyup')
            this.handleKeyUp(event);
    }

    movePlayer(index, direction, value) {
        if (!this.side) {
            if (this.players[index] && this.animationIsFinish == true) {
                this.players[index][direction] = value;
            }
        } else if (this.side == "left" && index == 0) {
            this.players[index][direction] = value;
        }
        else if (this.side == "right" && index == 1) {
            this.players[index][direction] = value;
        }
    }

    changeCamera() {
        this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
    }

    handleKeyDown(event) {
        if (this.gameType != "1v1") {
            const localAction = keyMappingsLocal[event.key];
            if (localAction && localAction.press) {
                localAction.press(this);
            }
        } else {
            const onlineAction = keyMappingsOnline[event.key];
            if (onlineAction && onlineAction.press) {
                onlineAction.press(this, this.playerIndex);
            }
        }
    }

    handleKeyUp(event) {
        if (this.gameType != "1v1") {
            const localAction = keyMappingsLocal[event.key];
            if (localAction && localAction.release) {
                localAction.release(this);
            }
        } else {
            const onlineAction = keyMappingsOnline[event.key];
            if (onlineAction && onlineAction.release) {
                onlineAction.release(this, this.playerIndex);
            }

        }
    }

    setCameras(camera) {
        this.cameras.push(camera);
    }

    create() {

        function createLine(scene, material, width, height, depth, x, y, z, objects) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            scene.add(mesh);
            objects.push(mesh);
            return mesh;
        }

        function createPlane(scene, material, width, height, x, y, z, objects) {
            const geometry = new THREE.PlaneGeometry(width, height);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            scene.add(mesh);
            objects.push(mesh);
            return mesh;
        }


        var whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var groundMaterial = new THREE.MeshBasicMaterial({ color: 0x304053 });

        this.ground = createLine(this.scene, groundMaterial, 15.5, 7, 0.2, 0, 0, 0, this.objects);

        this.middleLine = createLine(this.scene, new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true }), 0.1, 6.9, 0.5, 0, 0, 0.3, this.objects);
        this.borderMiddleUp = createLine(this.scene, groundMaterial, 0.1, 0.1, 0.5, 0, 3.5, 0.3, this.objects);
        this.borderMiddleDown = createLine(this.scene, groundMaterial, 0.1, 0.1, 0.5, 0, -3.5, 0.3, this.objects);
        this.borderMiddleTop = createLine(this.scene, whiteMaterial, 0.05, 7.1, 0.05, 0, 0, 0.58, this.objects);

        this.longLine = createPlane(this.scene, whiteMaterial, 15.5, 0.03, 0, 0, 0.11, this.objects);
        this.borderLine = createPlane(this.scene, whiteMaterial, 15.5, 0.1, 0, -3.5, 0.11, this.objects);
        this.borderLine = createPlane(this.scene, whiteMaterial, 15.5, 0.1, 0, 3.5, 0.11, this.objects);

        this.goalLineRight = createPlane(this.scene, whiteMaterial, 0.1, 7.1, 7.75, 0, 0.11, this.objects);
        this.goalLineLeft = createPlane(this.scene, whiteMaterial, 0.1, 7.1, -7.75, 0, 0.11, this.objects);

        this.ball = new Ball(this.scene, this.objects, this);
        this.ball.createBall();

        const finalCameraPosition = new THREE.Vector3(0, -4, 7.5);
        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        camera1.position.copy(finalCameraPosition);
        this.gameStart = true;
        camera1.rotation.x = Math.PI / 7.5;
        this.scene.add(camera1);
        this.cameras.push(camera1);
        this.objects.push(this.cameras);
        this.animationIsFinish = true;

        this.players.splice(0, this.players.length);
        this.players.push(
            new Player(-7.9, this.gameType == "2v2" ? 1.7 : 1.5, this.scene, 0x3A85DF, this, this.objects, this.webSocket),
            new Player(this.gameType == "2v2" ? -7.9 : 7.9, this.gameType == "2v2" ? -1.7 : -1.5, this.scene, this.gameType == "2v2" ? 0x3A85DF : 0xDF413A, this, this.objects, this.webSocket),
            this.gameType == "2v2" ? new Player(7.9, 1.7, this.scene, 0xDF413A, this) : null,
            this.gameType == "2v2" ? new Player(7.9, -1.7, this.scene, 0xDF413A, this) : null
        );

        return [this.leftGoal, this.rightGoal];
    }

    stopCameraAnimation() {
        if (this.cameraAnimationId !== null) {
            cancelAnimationFrame(this.cameraAnimationId);
            this.cameraAnimationId = null;
        }
    }

    createScore(score) {
        var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32);
        var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(score, 3.8, 0.7);
        this.scene.add(cylinder);

        this.objects.push(cylinder);
    }

    createEndPopup(winner) {
        const wrapper = document.getElementById('main');

        const form = createElement('div');
        form.className = "position-absolute top-50 start-50 translate-middle bg-light p-4 border border-dark text-center";
        form.style = "min-width: 300px;";

        const message = createElement('div', { class: 'form-control mb-3 border border-dark' });
        message.innerHTML = window.route.getLocaleValue("victory");
        message.textContent = `${winner} ` + message.textContent;

        const closeButton = createElement('button', { class: "btn btn-primary" });
        closeButton.innerHTML = window.route.getLocaleValue("close");
        closeButton.addEventListener('click', () => {
            wrapper.removeChild(form);
            window.route.loadView("/");
        });

        form.appendChild(message);
        form.appendChild(closeButton);

        wrapper.appendChild(form);
    }
};
