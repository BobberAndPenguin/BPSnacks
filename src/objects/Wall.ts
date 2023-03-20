import Phaser from 'phaser'
import GameScene from '~/scenes/GameScene';

export default class Wall extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y, "wall");
		scene.add.existing(this);
		scene.physics.add.existing(this, true);

        this.setOrigin(0, 0);
        this.refreshBody();
	}
}