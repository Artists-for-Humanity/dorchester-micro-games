"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
// SCENES
const Main_1 = require("./scenes/Main");
const Menu_1 = require("./scenes/Menu");
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 1280;
const config = {
    type: Phaser.AUTO,
    backgroundColor: '#2DC1F8',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    scene: [Menu_1.default, Main_1.default],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 400 }
        }
    }
};
window.addEventListener('load', () => {
    if (window.location.pathname.includes('future')) {
        const game = new Phaser.Game(config);
    }
});
