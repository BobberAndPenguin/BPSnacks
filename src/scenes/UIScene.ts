export default class UIScene extends Phaser.Scene {
    scoreText: Phaser.GameObjects.Text | undefined;

	constructor() {
	  super({ key: 'UIScene' });
	}
  
	create() : void {
		this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', color: '#000' });
		this.scoreText.setDepth(99999);
	}
  }