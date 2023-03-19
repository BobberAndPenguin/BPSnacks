class UIScene extends Phaser.Scene {
	constructor() {
	  super({ key: 'UIScene' });
	}
  
	create() {
	  // create UI elements, such as score display and menu button
		this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#000' });
		this.scoreText.setDepth(99999);

		console.log("here");

	}
  }

class PenguinGame extends Phaser.Scene {
	constructor() {
		super({
			key: "PenguinGame"
		});
	}
	preload() {
		this.load.image("penguin", "assets/penguin.png");
		this.load.spritesheet("penguin_idle", "assets/64X128_Idle_Free.png", {
			frameWidth: 64,
			frameHeight: 128
		});

		this.load.spritesheet("penguin_run", "assets/64X128_Runing_Free.png", {
			frameWidth: 64,
			frameHeight: 128
		});

		this.load.spritesheet('cat_idle', 'assets/pets/Cat-2/Cat-2-Idle.png', {
			frameWidth: 50,
			frameHeight: 50
		});

		this.load.spritesheet('cat_run', 'assets/pets/Cat-2/Cat-2-Run.png', {
			frameWidth: 50,
			frameHeight: 50
		});

		this.load.image("table", "assets/table4.png");
		this.load.image("tile", "assets/tileplanks.png");
		this.load.image("food1", "assets/foods/hot_cocoa_mix.png");
		this.load.image("food2", "assets/foods/sliced_bread_p.png");
		this.load.image("food3", "assets/foods/potatochip_green.png");
		this.load.image("food4", "assets/foods/potatochip_blue.png");
		this.load.image("food5", "assets/foods/potatochip_yellow.png");
		//this.load.image("tilemap", "assets/kitchen_tiles/tileset.png");
		this.load.image("counter", "assets/counter.png");
		this.load.image("wall", "assets/wall.png");
	}

	create() {
		const { width, height } = this.game.config;

		this.scene.launch('UIScene');
    	this.scene.bringToTop('UIScene');

		this.score = 0;

		this.physics.world.setBounds(0, 64, width, height - 64);
		this.tilesprite = this.add.tileSprite(0, 0, width, height, "tile").setScale(2);

		this.wall = new Wall(this, 0, 0);
		this.counter = new Counter(this, 200, 100);

		this.tables = [];

		this.tables.push(new Table(this, width / 2, height * 0.75));
		this.tables.push(new Table(this, width / 2 + 200, height * 0.75));

		// Draw penguin on top of scene
		this.penguin = new Penguin(this, 100, 300);

		this.input.on('pointerdown', this.onPointerDown, this);

		this.physics.add.overlap(this.penguin, this.food, function (penguin, food) {
			if (penguin.moveTarget == null && penguin.holding == null) {
				penguin.pickUp(food);
			}
		});

		this.physics.add.collider(this.penguin, this.wall, (penguin, wall) => {
			this.penguin.cancelMovement();
		});

		this.tables.forEach(t => {
			this.physics.add.collider(this.penguin, t, (penguin, table) => {
				this.penguin.cancelMovement();
				if (penguin.moveTarget == null && penguin.holding != null) {
					const obj = penguin.holding;
					penguin.dropItem();

					setTimeout(() => {
						obj.initialize(200, 400);
					}, 2000);
				}
			});
		});


		this.physics.add.collider(this.penguin, this.counter, (penguin, counter) => {
			penguin.cancelMovement();
		});
	}

	update() {
		// if (this.input.mousePointer.leftButtonDown()) {
		// 	this.onPointerDown(this.input.mousePointer);
		// }

		this.penguin.update();
		this.food?.update();

	}

	onPointerDown(pointer) {
		this.penguin.moveTo(pointer.x, pointer.y);
	}

	incrementScore() {
		this.score += 1;
		const uiScene = this.scene.get('UIScene');
		uiScene.scoreText.setText('Score: ' + this.score);
	}
}


class Cat extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "cat_idle", 0);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCollideWorldBounds(true);
		this.body.onWorldBounds = true;

		this.setScale(2);
		this.setSize(this.width / 2, this.height / 2);
		//this.scene.physics.world.on("worldbounds", this.onWorldBoundsCollision, this);
		this.initAnimations();
	}


	initAnimations() {
		this.anims.create({
			key: 'cat_idle',
			frames: this.anims.generateFrameNumbers('cat_idle', {
				start: 0,
				end: 9
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.play('cat_idle', true);
	}
}

function addShadowToObject(object, scene) {
	const shadow = scene.add.graphics({ x: object.x, y: object.y });
	shadow.fillStyle(0x8e716d, 0.6);
	const shadowEllipse = new Phaser.Geom.Ellipse(0, 0, 32, 16);
	shadow.fillEllipseShape(shadowEllipse);
	object.setPipeline("ShadowPipeline", shadow);

	// keep the shadow in sync with the object
	shadow.update = () => {
		shadow.x = object.x;
		shadow.y = object.y + 10;
		shadow.flipX = object.flipX;
	};

	// return the shadow sprite
	return shadow;
}



class Wall extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "wall");

		this.setOrigin(0, 0);

		scene.add.existing(this);
		scene.physics.add.existing(this, true);
	}
}
class Counter extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "counter");

		this.setOrigin(0, 0);
		this.setScale(1.1);
		this.setDepth(this.y + 160);

		scene.add.existing(this);
		scene.physics.add.existing(this, true);
	}
}

class Food extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		let foodSprites = ["food1", "food2", "food3", "food4", "food5"];
		const spriteKey = foodSprites[Math.floor(Math.random() * foodSprites.length)]

		super(scene, x, y, spriteKey);
		this.foodSprites = foodSprites;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setDepth(4);

		this.shadow = addShadowToObject(this, this.scene);

		this.holder = null;
	}

	picked(holder) {
		console.log("food picked up");

		this.shadow.visible = false;
		this.shadow.active = false;
		this.holder = holder;
	}

	dropped() {
		console.log("food dropped off");
		this.x = -100;
		this.y = -100;

		this.holder = null;
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

		this.shadow = addShadowToObject(this, this.scene);
	}
}


class Penguin extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "penguin_idle", 0);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCollideWorldBounds(true);
		this.body.onWorldBounds = true;

		this.scene.physics.world.on("worldbounds", this.onWorldBoundsCollision, this);

		this.tolerance = 10;
		this.speed = 400;

		this.body.setSize(32, 32);
		this.body.setOffset(16, 64 + 8);

		this.setOrigin(0.5, 0.75);
		this.setDepth(5);

		this.initAnimations();
		this.holding = null;

		this.lastDirection = "down";

	}

	onWorldBoundsCollision(body) {
		this.cancelMovement();

	}

	initAnimations() {
		const anims = {
			up: {
				startFrame: 24,
				endFrame: 31
			},
			down: {
				startFrame: 0,
				endFrame: 7
			},
			left: {
				startFrame: 8,
				endFrame: 15
			},
			right: {
				startFrame: 16,
				endFrame: 23
			}
		};

		Object.keys(anims).forEach((dir) => {
			const { startFrame, endFrame } = anims[dir];
			const runAnim = `penguin_${dir}_run`;
			this.anims.create({
				key: runAnim,
				frames: this.anims.generateFrameNumbers('penguin_run', {
					start: startFrame,
					end: endFrame
				}),
				frameRate: 10,
				repeat: -1
			});

			const idleAnim = `penguin_${dir}_idle`;
			this.anims.create({
				key: idleAnim,
				frames: this.anims.generateFrameNumbers('penguin_idle', {
					start: startFrame,
					end: endFrame
				}),
				frameRate: 10,
				repeat: -1
			});
		});

		this.anims.play('penguin_down_idle', true);
	}

	pickUp(object) {
		if (this.holding == null) {
			this.holding = object;
			this.holding.picked(this);
		}
	}

	dropItem() {
		if (this.holding) {
			this.holding.dropped();
			this.holding = null;

			this.scene.incrementScore();
		}
	}

	moveTo(x, y) {
		this.moveTarget = new Phaser.Math.Vector2(x, y);
		this.scene.physics.moveToObject(this, this.moveTarget, this.speed);
	}

	cancelMovement() {
		this.body.setVelocity(0);
		this.moveTarget = null;
		this.anims.play(`penguin_${this.lastDirection}_idle`, true);
	}

	update() {
		this.setDepth(this.y);

		if (this.moveTarget) {
			const distance = Phaser.Math.Distance.Between(
				this.x,
				this.y,
				this.moveTarget.x,
				this.moveTarget.y
			);

			const vel = this.body.velocity;
			if (Math.abs(vel.x) > Math.abs(vel.y)) {
				this.lastDirection = vel.x > 0 ? "right" : "left";
			} else {
				this.lastDirection = vel.y > 0 ? "down" : "up";
			}

			this.anims.play(`penguin_${this.lastDirection}_run`, true);

			if (distance < this.tolerance) {
				this.cancelMovement();
			}
		}
	}
}

class Table extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "table");
		scene.add.existing(this);
		scene.physics.add.existing(this, true);
		this.setOrigin(0.5, 0.5);
		this.setDepth(this.y + 32);

		const distance = Phaser.Math.Distance.Between(
			this.x,
			this.y,
			this.scene.penguin?.x,
			this.scene.penguin?.y
		);
	}

	update() {
		;
	}
}

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
	scene: [PenguinGame, UIScene],
	backgroundColor: '#d49c61',
	pixelArt: true
};

const game = new Phaser.Game(config);