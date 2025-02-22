import Boot from './scenes/Boot';
import MainGame from './scenes/Game';
import MainMenu from './scenes/MainMenu';
import Preloader from './scenes/Preloader';
import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300},
            height: 1000,
        }
    },
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame
    ]
};

export default new Game(config);
