export default class Train extends Phaser.GameObjects.Group {
  cooldown: number;
  backgroundX: number;
  backgroundY: number;

  constructor(scene, x: number, y: number) {
    super(scene, []);
    this.cooldown = 500; // milliseconds;
    this.backgroundX = x;
    this.backgroundY = y;
  }

  create() {
    const track = new Phaser.GameObjects.Image(this.scene, this.backgroundX, this.backgroundY, 'train-track');
    this.scene.add.existing(track);
    // image(0, this.game.canvas.height - (this.textures.get(texture).getSourceImage().height) - demo, texture);
  }

  update() {
    setInterval(() => {
      
    })
  }
}