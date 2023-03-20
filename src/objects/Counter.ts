import GameScene from "~/scenes/GameScene";

export default class Counter extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y, "counter");
        scene.add.existing(this);
		scene.physics.add.existing(this, true);

		this.setOrigin(0, 0);
        this.setDisplayOrigin(0, 0);
		this.setScale(1.1);
		this.setDepth(this.y + 160);	

        this.refreshBody();
	}
}