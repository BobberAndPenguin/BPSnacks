import Penguin from '~/objects/Penguin';
import Phaser from 'phaser';
import GameObjectUtils from '~/utils/GameObjectUtils';

export default class Food extends Phaser.Physics.Arcade.Sprite {
    foodSprites: string[];
    shadow: any;
    holder?: Penguin;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		let foodSprites = ["food1", "food2", "food3", "food4", "food5"];
		const spriteKey = foodSprites[Math.floor(Math.random() * foodSprites.length)]

		super(scene, x, y, spriteKey);
		this.foodSprites = foodSprites;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setScale(1);
		this.setDepth(this.y + 50);	

		this.shadow = GameObjectUtils.addShadowToObject(this, this.scene);

		this.holder = undefined;
	}

	picked(holder: Penguin) {
		console.log("food picked up");

		this.shadow.visible = false;
		this.shadow.active = false;
		this.holder = holder;
	}

	dropped() {
		console.log("food dropped off");
		this.x = -100;
		this.y = -100;

		this.holder = undefined;
		this.shadow.destroy();
	}

	update() {
		if (this.holder) {
			this.setDepth(this.holder.depth + 1);
			this.x = this.holder.x;
			this.y = this.holder.y - 20;
		} else {
			this.setDepth(this.y)
		}
		this.shadow.update();
	}

	initialize(x, y) {
		this.x = x;
		this.y = y;

		const spriteKey = this.foodSprites[Math.floor(Math.random() * this.foodSprites.length)]
		this.setTexture(spriteKey);
		this.visible = true;
		this.active = true;
		this.setDepth(4);

		this.shadow = GameObjectUtils.addShadowToObject(this, this.scene);
	}
}
