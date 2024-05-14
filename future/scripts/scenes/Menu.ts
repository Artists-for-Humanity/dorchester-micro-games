import Phaser from 'phaser'
import WebFontFile from '../../../util/WebFontFile'

export default class Menu extends Phaser.Scene
{
	clouds: Phaser.GameObjects.Sprite[];

	constructor() {
		super('Menu');
		this.clouds = [];
	}

	preload() {
		[1, 2, 3, 4, 5].forEach(cloud => {
			this.load.image(`clouds${cloud}`, `assets/img/cloud${cloud}.png`);
		});
	}

	create() {
    document.getElementById('overlay-btn')!.onclick = () => {
			document.getElementById('menu-overlay')!.style.display = 'none';
      this.scene.start('Main');
    }

		this.clouds.push(this.add.sprite(-350, this.game.canvas.height / 2, `clouds1`).setScale(1));
		this.clouds.push(this.add.sprite(-350, this.game.canvas.height / 3, `clouds2`).setScale(0.75));
		this.clouds.push(this.add.sprite(-350, 2 * this.game.canvas.height / 3, `clouds3`).setScale(0.5));
		this.clouds.push(this.add.sprite(-350, 1 * this.game.canvas.height / 7, `clouds4`).setScale(0.25));
		this.clouds.push(this.add.sprite(-350, 6 * this.game.canvas.height / 7, `clouds5`).setScale(0.75));
	}

	update() {
		this.clouds.forEach((cloud, i) => {
			cloud.x += 2 + i;

			if (cloud.x > this.game.canvas.width + 350) {
				cloud.x = -350;
			}
		});
	}
}