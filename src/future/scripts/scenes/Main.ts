import { Game, GameObjects, Math as PhaserMath, Physics } from "phaser";

interface BaseTravelComponent {
  texture: string,
  spaces: number
}

export default class MainScene extends Phaser.Scene {
  player: GameObjects.Sprite
  lastMoveTime = 500;
  game: Game;
  lastTextureTotal = 0;
  components: { texture: string; spaces: number }[] = [];
  tiles: GameObjects.Group;

  constructor() {
    super({ key: 'Main' })
  }

  preload() {
    this.load.image('grass', 'assets/img/grass.png');
    this.load.image('road-lanes-2', 'assets/img/road-lanes-2.png');
    this.load.image('train-track', 'assets/img/train-track.png');
	}

  create() {
    document.getElementById('game-overlay')!.style.display = 'flex';

    // Create the player sprite
    this.tiles = this.add.group([]);
    this.player = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height - 300, 'player')
      .setDepth(2);


    const getTileScale = (textureKey: string) => {
      // the diagonal should fit the width of the screen, so find the ratio between the width and height and adjust accordingly
      // the diagonal size can be found using the pytahogrean theorem
      const texture = this.textures.get(textureKey).getSourceImage();

      return Math.hypot(texture.width, texture.height);
    }

    this.components.push(
      TravelComponentFactory('grass', 3),
      TravelComponentFactory('road-lanes-2', 2),
      TravelComponentFactory('grass', 3),
      TravelComponentFactory('train-track', 2),
      TravelComponentFactory('train-track', 2),
      TravelComponentFactory('grass', 3),
      TravelComponentFactory('road-lanes-2', 2),

    )

    let demo = 0;
    this.components.forEach((component: BaseTravelComponent ) => {
      const { texture } = component;
      const img = this.add.image(0, this.game.canvas.height - (this.textures.get(texture).getSourceImage().height) - demo, texture)
        .setOrigin(0)
        .setScale(getTileScale('grass'), 1)
        .setRotation(PhaserMath.DegToRad(5));
      
      this.tiles.add(img);
      demo += this.textures.get(texture).getSourceImage().height;
    })
  
    // Capture keyboard input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.moveTiles();
    });
    
    [
      
    ]
  }

  generateMap() {
    // some sort of algorithm to generate the components on update
  }
    
  update() {
    // this.movePlayer();
    // Reset player velocity
    // this.player.setVelocity(0);
  
    // Allow only left movement
    // this.player.setVelocityX(-100);
    // this.tiles.incY(2)
    if ((this.tiles.getChildren()[0] as GameObjects.Image).y > this.game.canvas.height) {
      this.tiles.remove(this.tiles.getChildren()[0] as GameObjects.Image, true, true);
    }
  }
  
  moveTiles() {
    this.tiles.children.iterate((tile) => {
      this.tweens.add({
          targets: tile,
          y: (tile as GameObjects.Image).y + 70,
          duration: 500,
          ease: 'Sine.easeInOut'
      });
  });
  }
}

function TravelComponentFactory(texture: string, spaces: number, action?: () => void): BaseTravelComponent {
  return { texture, spaces };
}