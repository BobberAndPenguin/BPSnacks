import Phaser, { GameObjects } from 'phaser'
import Counter from '~/objects/Counter';
import Penguin from '~/objects/Penguin';
import Table from '~/objects/Table';
import Wall from '~/objects/Wall';
import UIScene from './UIScene';

export default class GameScene extends Phaser.Scene {
	score: number;

	penguin!: Penguin;
	wall!: Wall;
	counter!: Counter;
	tables!: Table[];
	
	constructor() {
		super({key: "GameScene"});
		this.score = 0;
	}

	preload() : void {
		this.load.setBaseURL("assets/");
        this.load.image("penguin", "penguin.png");
		this.load.spritesheet("penguin_idle", "64X128_Idle_Free.png", {
			frameWidth: 64,
			frameHeight: 128
		});

		this.load.spritesheet("penguin_run", "64X128_Runing_Free.png", {
			frameWidth: 64,
			frameHeight: 128
		});

		this.load.spritesheet('cat_idle', 'pets/Cat-2/Cat-2-Idle.png', {
			frameWidth: 50,
			frameHeight: 50
		});

		this.load.spritesheet('cat_run', 'pets/Cat-2/Cat-2-Run.png', {
			frameWidth: 50,
			frameHeight: 50
		});

		this.load.image("table", "table4.png");
		this.load.image("tile", "tileplanks.png");
		this.load.image("food1", "foods/hot_cocoa_mix.png");
		this.load.image("food2", "foods/sliced_bread_p.png");
		this.load.image("food3", "foods/potatochip_green.png");
		this.load.image("food4", "foods/potatochip_blue.png");
		this.load.image("food5", "foods/potatochip_yellow.png");
		this.load.image("counter", "counter.png");
		this.load.image("wall", "wall.png");
    }

    create() : void {
		const { width, height } = this.sys.game.canvas;
		this.scene.launch('UIScene');
    	this.scene.bringToTop('UIScene');

		this.physics.world.setBounds(0, 64, width, height - 64);
		const tilesprite = this.add.tileSprite(0, 0, width, height, "tile").setScale(2);

		this.wall = new Wall(this, 0, 0);
		this.counter = new Counter(this, 200, 100);

		this.tables = [];

		this.tables.push(new Table(this, width / 2, height * 0.75));
		this.tables.push(new Table(this, width / 2 + 200, height * 0.75));

		this.penguin = new Penguin(this, 100, 300);

		this.input.on('pointerdown', this.onPointerDown, this);

		this.physics.add.collider(this.penguin, this.wall, (penguin : GameObjects.GameObject, wall : GameObjects.GameObject) => {
			(penguin as Penguin).cancelMovement();
		});

		this.tables.forEach(table => {
			this.physics.add.collider(this.penguin, table, (penguin : Phaser.GameObjects.GameObject, table : Phaser.GameObjects.GameObject) => {
				this.penguin.cancelMovement();
				if ((penguin as Penguin).moveTarget == undefined && (penguin as Penguin).holding != null) {
					const obj = (penguin as Penguin).holding;
					(penguin as Penguin).dropItem();

					setTimeout(() => {
						obj.initialize(200, 400);
					}, 2000);
				}
			});
		});


		this.physics.add.collider(this.penguin, this.counter, (penguin : Phaser.GameObjects.GameObject, table : Phaser.GameObjects.GameObject) => {
			(penguin as Penguin).cancelMovement();
		});
    }

    update(time: number, delta: number): void {
        // if (this.input.mousePointer.leftButtonDown()) {
		// 	this.onPointerDown(this.input.mousePointer);
		// }

		this.penguin.update();
    }

	onPointerDown(pointer: { x: number; y: number; }) : void {
		this.penguin.moveTo(pointer.x, pointer.y);
	}

	incrementScore() : void {
		this.score += 1;
		const uiScene = (this.scene.get('UIScene') as UIScene);
		uiScene.scoreText?.setText('Score: ' + this.score);
	}
}
