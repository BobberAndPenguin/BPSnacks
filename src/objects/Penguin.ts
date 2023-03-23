import Phaser from 'phaser';
import GameScene from '~/scenes/GameScene';

export default class Penguin extends Phaser.Physics.Arcade.Sprite {
    tolerance: number;
    speed: number;
    holding: any;
    lastDirection: string;
	moveTarget: Phaser.Math.Vector2 | undefined;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y, "penguin_idle", 0);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCollideWorldBounds(true);

		this.scene.physics.world.on("worldbounds", this.onWorldBoundsCollision, this);

		this.tolerance = 10;
		this.speed = 400;

		this.body.setSize(32, 32);
		this.body.setOffset(16, 64 + 8);

		this.setOrigin(0.5, 0.75);
		this.setDepth(5);

		this.initAnimations();
        this.lastDirection = "down";

		this.holding = null;
	}

	onWorldBoundsCollision(body : any) : void {
		this.cancelMovement();
	}

	initAnimations() : void {
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

	pickUp(object: any) : void {
		if (this.holding != null) {
            return;
        }

        this.holding = object;
        this.holding.picked(this);
	}

	dropItem() : void {
		if (!this.holding) {
			return;
		}

		this.holding.dropped();
		this.holding = null;
		(this.scene as GameScene).incrementScore();
		
	}

	moveTo(x: number, y: number) : void {
		this.moveTarget = new Phaser.Math.Vector2(x, y);
		this.scene.physics.moveToObject(this, this.moveTarget, this.speed);
	}

	cancelMovement() {
		this.setVelocity(0);
		this.moveTarget = undefined;
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