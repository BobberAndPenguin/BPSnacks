import Phaser from 'phaser'

import GameScene from './scenes/GameScene'
import UIScene from './scenes/UIScene'

const config = {
	type: Phaser.AUTO,
	width: 1024,
	height: 576,
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
		},
	},
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [GameScene, UIScene],
	backgroundColor: '#d49c61',
	pixelArt: true
};

export default new Phaser.Game(config);
