import Phaser from 'phaser'
import GameScene from '~/scenes/GameScene';

export default class Table extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y, "table");
		scene.add.existing(this);
		scene.physics.add.existing(this, true);
		this.setOrigin(0.5, 0.5);
		this.setDepth(this.y + 32);

        this.refreshBody();
	}

	update() {
		;
	}
}