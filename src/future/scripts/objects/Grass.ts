import { GameObjects, Math as PhaserMath } from "phaser";

export default class Grass extends Phaser.GameObjects.Image {
  tiles: GameObjects.GameObject[]
  /*
        const { texture } = component;
      const img = this.add.image(0, this.game.canvas.height - (this.textures.get(texture).getSourceImage().height) - demo, texture)
        .setOrigin(0)
        .setScale(this.getTileScale('grass'), 1)
        .setRotation(PhaserMath.DegToRad(5));
      
      this.tiles.add(img);
      demo += this.textures.get(texture).getSourceImage().height;
  */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'grass');
  }
}