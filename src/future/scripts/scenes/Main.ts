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
  xOffset: number

  constructor() {
    super({ key: 'Main' })
  }

  preload() {
    this.load.image('grass', 'assets/img/grass.png');
    this.load.image('road-lanes-2', 'assets/img/road-2.png');
    this.load.image('train-track', 'assets/img/train-track.png');
	}

  getTileScale(textureKey: string) {
    // the diagonal should fit the width of the screen, so find the ratio between the width and height and adjust accordingly
    // the diagonal size can be found using the pytahogrean theorem
    const texture = this.textures.get(textureKey).getSourceImage();

    return Math.hypot(texture.width, texture.height);
  }

  create() {
    document.getElementById('game-overlay')!.style.display = 'flex';
    document.getElementById('phaser-game')!.style.backgroundColor = '#B9F065'

    // Create the player sprite
    this.tiles = this.add.group([]);
    this.player = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height - 300, 'player')
      .setDepth(2);


    this.components.push(
      TravelComponentFactory('grass', 3),
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
        .setScale(this.getTileScale('grass'), 1)
        .setRotation(PhaserMath.DegToRad(5));
      
      this.tiles.add(img);
      demo += this.textures.get(texture).getSourceImage().height;
    })
  
    // Capture keyboard input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.moveTiles();
    });
    
    ['ctrl-up', 'ctrl-left', 'ctrl-right', 'ctrl-down'].forEach(control => {
      document.getElementById(control)!.addEventListener('click', () => {
        this.moveMap(control.split('-')[1] as 'up' | 'down' | 'right' | 'left');
      })
    })
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

  isTweening = false;

  moveMap(direction: 'up' | 'down' | 'right' | 'left') {
    const texture = ['grass', 'grass', 'grass', 'grass', 'road-lanes-2', 'train-track'][Math.floor(Math.random() * 6)];

    const children = this.tiles.getChildren();

    const img = new Phaser.GameObjects.Image(this, 0,
      (children[children.length - 1] as Phaser.GameObjects.Image).y - (this.textures.get(texture).getSourceImage().height),// children.map(c => (c as GameObjects.Image).height).reduce((prev, curr) => prev + curr),
    texture)
    .setOrigin(0)
    .setScale(this.getTileScale(texture), 1)
    .setRotation(PhaserMath.DegToRad(5));

    this.add.existing(img);
    this.tiles.add(img);

    console.log(this.tiles.getChildren().map(c => (c as GameObjects.Image).texture.key));

    if (this.isTweening) return;
    switch(direction) {
      case "up": {
        this.tiles.children.iterate((tile) => {
          this.tweens.add({
              targets: tile,
              y: (tile as GameObjects.Image).y + 70,
              duration: 500,
              ease: 'Sine.easeInOut',
              onStart: () => { this.isTweening = true; },
              onComplete: () => { this.isTweening = false; }
          });
        });
        break;
      }
      case "down": {
        this.tiles.children.iterate((tile) => {
          this.tweens.add({
              targets: tile,
              y: (tile as GameObjects.Image).y - 70,
              duration: 500,
              ease: 'Sine.easeInOut',
              onStart: () => { this.isTweening = true; },
              onComplete: () => { this.isTweening = false; }
          });
        });
        break;
      }
      case "right": {
        this.tweens.add({
          targets: this.player,
          x: (this.player as GameObjects.Sprite).x + 70,
          y: (this.player as GameObjects.Sprite).y + (70 * Math.tan(PhaserMath.DegToRad(5))),
          duration: 500,
          ease: 'Sine.easeInOut',
          onStart: () => { this.isTweening = true; },
          onComplete: () => { this.isTweening = false; }
        });
        break;
      }
      case "left": {
        this.tweens.add({
          targets: this.player,
          x: (this.player as GameObjects.Sprite).x - 70,
          y: (this.player as GameObjects.Sprite).y - (70 * Math.tan(PhaserMath.DegToRad(5))),
          duration: 500,
          ease: 'Sine.easeInOut',
          onStart: () => { this.isTweening = true; },
          onComplete: () => { this.isTweening = false; }
        });
      }
    }
  }
}

function TravelComponentFactory(texture: string, spaces: number, action?: () => void): BaseTravelComponent {
  return { texture, spaces };
}