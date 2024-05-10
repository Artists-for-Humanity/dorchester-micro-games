"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = require("phaser");
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Main' });
        this.lastMoveTime = 500;
        this.lastTextureTotal = 0;
        this.components = [];
    }
    preload() {
        this.load.image('grass', '../../assets/img/grass.png');
        this.load.image('road-lanes-2', '/future/assets/img/road-lanes-2.png');
        this.load.image('train-track', '/future/assets/img/train-track.png');
    }
    create() {
        // Create the player sprite
        this.player = this.physics.add.sprite(400, 300, 'player');
        const getTileScale = (textureKey) => {
            // the diagonal should fit the width of the screen, so find the ratio between the width and height and adjust accordingly
            // the diagonal size can be found using the pytahogrean theorem
            const texture = this.textures.get(textureKey).getSourceImage();
            return Math.hypot(texture.width, texture.height);
        };
        this.components.push(TravelComponentFactory('grass', 3), TravelComponentFactory('road-lanes-2', 2), TravelComponentFactory('grass', 3), TravelComponentFactory('train-track', 2));
        const textures = ['grass', 'road-lanes-2', 'grass', 'train-track'];
        let demo = 0;
        this.components.forEach((component) => {
            const { texture } = component;
            this.add.image(0, this.game.canvas.height - (this.textures.get(texture).getSourceImage().height) - demo, texture).setOrigin(0).setScale(getTileScale('grass'), 1).setRotation(phaser_1.Math.DegToRad(5));
            demo += this.textures.get(texture).getSourceImage().height;
        });
        // Set collision bounds
        this.player.setCollideWorldBounds(true);
        // Capture keyboard input
        this.input.keyboard.on('keydown-SPACE', this.movePlayer);
    }
    generateMap() {
    }
    update() {
        // this.movePlayer();
        // Reset player velocity
        // this.player.setVelocity(0);
        // Allow only left movement
        // this.player.setVelocityX(-100);
    }
    movePlayer() {
        // Check cooldown
        if (this.game.getTime() - this.lastMoveTime > 300) {
            // Set last move time
            this.lastMoveTime = this.game.getTime();
            // Set player velocity to move at -10 degrees
            this.player.setVelocity(-100 * Math.cos(10 * Math.PI / 180), -100 * Math.sin(10 * Math.PI / 180));
        }
    }
}
exports.default = MainScene;
function TravelComponentFactory(texture, spaces) {
    return { texture, spaces };
}
