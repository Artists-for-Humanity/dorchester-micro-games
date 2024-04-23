import { Math as PhaserMath } from "phaser";

export default class Train extends Phaser.GameObjects.Container {
  cooldown: number;
  backgroundX: number;
  backgroundY: number;
  isRunning: boolean;
  coolingDelta: number;
  lastTime: Date;
  track: Phaser.GameObjects.Image;
  train: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, []);

    scene.add.existing(this);
    scene.events.on('create', this.create, this);
    scene.events.on('update', this.update, this);

    this.cooldown = 500; // milliseconds;
    this.backgroundX = x;
    this.backgroundY = y;

    console.log(x, y);
  }

  create() {
    this.track = new Phaser.GameObjects.Image(this.scene, -this.scene.game.canvas.width / 2, this.backgroundY, 'train-track')
      .setDepth(0)
      .setOrigin(0);

    this.train = new Phaser.GameObjects.Sprite(this.scene, this.backgroundX + 500, this.backgroundY, 'train')
      .setDepth(1)
      .setOrigin(0);

    this.scene.add.existing(this.track);
    this.scene.add.existing(this.train);
    this.add([ this.track, this.train ]).setDepth(10);

    // image(0, this.game.canvas.height - (this.textures.get(texture).getSourceImage().height) - demo, texture);
  }

  update() {
    if (!this.isRunning) {
      this.scene?.tweens.add({
        targets: this.train,
        x: this.backgroundX - 1000,
        duration: 1000,
        onStart: () => {
          this.isRunning = true;
        },
        onComplete: () => {
          const cooldown = (Math.random() * 10000) + 2000; // anywhere between 2 and 12 seconds
          console.log(`waiting for ${cooldown / 1000}s...`)
          setTimeout(() => {
            console.log('warning');
            setTimeout(() => {
              this.isRunning = false;
              this.train?.setPosition(this.backgroundX + 500, this.backgroundY);
            }, 2000);
          }, cooldown - 2000);
        }
      })
    }
  }
}