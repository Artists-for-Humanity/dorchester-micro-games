import { Game, GameObjects, Math as PhaserMath, Physics } from "phaser";
import Train from "../objects/Train";
import Grass from "../objects/Grass";

type RoadComponent = Train | Grass;

export default class MainScene extends Phaser.Scene {
  player: GameObjects.Sprite
  lastMoveTime = 500;
  game: Game;
  lastTextureTotal = 0;
  components: ('road' | 'grass' | 'train')[] = [];
  tiles: GameObjects.Group;
  xOffset: number
  lastObject: GameObjects.Container | GameObjects.Image
  layerPriority = 0;

  constructor() {
    super({ key: 'Main' })
  }

  preload() {
    this.load.image('grass', 'assets/img/grass.png');
    this.load.image('road', 'assets/img/road-2.png');
    this.load.image('train-track', 'assets/img/train-track.png');
    this.load.image('train', 'assets/img/train.png');
	}

  getTileScale(textureKey: string) {
    // the diagonal should fit the width of the screen, so find the ratio between the width and height and adjust accordingly
    // the diagonal size can be found using the pytahogrean theorem
    const texture = this.textures.get(textureKey).getSourceImage();

    const getTileScale = (textureKey: string) => {
      // the diagonal should fit the width of the screen, so find the ratio between the width and height and adjust accordingly
      // the diagonal size can be found using the pytahogrean theorem
      const texture = this.textures.get(textureKey).getSourceImage();

    const level = ['grass', 'grass', 'road', 'grass', 'train', 'train', 'grass'];

    this.components.push(
      ...(level as typeof this.components),
    )

    this.components.forEach((component) => {
      this.generateMap(component);
    })

  
    // Set collision bounds
    // this.player.setCollideWorldBounds(true);
  
    // Capture keyboard input
    this.input.keyboard.on('keydown-SPACE', this.movePlayer);
  }

  generateMap(component: typeof this.components[number]) {
    console.log(`now rendering a ${component} where the last object has a y of ${this.lastObject?.displayOriginY}`)
    switch (component) {
      case "road":
        const img = this.add.image(0, (this.lastObject?.y || this.game.canvas.height) - (75 * 2), 'road')
          .setOrigin(0);

        this.tiles.add(img);
        this.lastObject = img;
        break
      case "grass": {
        const img = this.add.image(0, (this.lastObject?.y || this.game.canvas.height) - (75 * 3), 'grass')
          .setOrigin(0)
          .setScale(this.getTileScale('grass'), 1);

          this.tiles.add(img);
          this.lastObject = img;
        break;
      }
      case "train": {
        const train = new Train(this, this.game.canvas.width / 2, (this.lastObject?.y || this.game.canvas.height) - (75 * 0.75));
        this.add.existing(train);

        this.tiles.add(train);
        this.lastObject = train;
        console.log(`lastobj y: ${this.lastObject.displayOriginY} ${this.lastObject.y}`)
      }
    }

    console.log(`the rendered lastobj now has a y of ${this.lastObject.y}`)

    this.player = this.add.sprite(this.game.canvas.width / 2, this.game.canvas.height - (75 * 3.5), 'player')
      .setDepth(100);


    this.components.push(
      'grass', 'grass', 'train', 'grass', 'train'
    )

    this.components.forEach((component) => {
      const children = this.tiles.getChildren() as (typeof this.lastObject)[];
      
      this.generateMap(component);

      // if (component.type === 'RoadImage') {
      //   const uninteractiveComponent = component as {texture: string, spaces: number, type: 'RoadImage'};
      //   const { texture } = uninteractiveComponent;
      //   const img = this.add.image(0, this.game.canvas.height - (this.textures.get(texture).getSourceImage().height) - this.demo, texture)
      //     .setOrigin(0)
      //     .setScale(this.getTileScale('grass'), 1)
      //     .setDepth(this.layerPriority + 1);
      //   this.tiles.add(img);
      //   console.log(`grass: ${this.textures.get(texture).getSourceImage().height}`)
      //   this.demo += this.textures.get(texture).getSourceImage().height;
      //   this.layerPriority++;
      // } else {
      //   const roadComponent: RoadComponent = component as RoadComponent;
      //   roadComponent
      //     .setPosition(this.game.canvas.width / 2, this.game.canvas.height - (roadComponent.displayHeight) - this.demo)
      //     .setDepth(this.layerPriority + 1);
        
      //   this.layerPriority++;
      //   this.add.existing(roadComponent);
      //   this.tiles.add(roadComponent);
      //   console.log(this.textures.get('train-track').getSourceImage().height);
      //   this.demo += this.textures.get('train-track').getSourceImage().height;
      // }
      // console.log(component.type, this.demo);
    })

    // const train = new Train(this, this.game.canvas.width / 2, this.game.canvas.height / 2).setDepth(5);
    // 
  
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
    
  update() {
    if ((this.tiles.getChildren()[0] as GameObjects.Image).y > this.game.canvas.height) {
      this.tiles.remove(this.tiles.getChildren()[0] as GameObjects.Image, true, true);
    }
  }
  
  moveTiles() {
    this.tiles.children.iterate((tile) => {
      this.tweens.add({
          targets: tile,
          y: (tile as GameObjects.Image).y + 75,
          duration: 500,
          ease: 'Sine.easeInOut'
      });
    });
  }

  isTweening = false;

  moveMap(direction: 'up' | 'down' | 'right' | 'left') {
    if (this.isTweening) return;
    const componentType = ['grass', 'train'][Math.floor(Math.random() * 2)] as typeof this.components[number];
    
    this.generateMap(componentType);


    // console.log(this.tiles.getChildren().map(c => (c as GameObjects.Image).texture.key));
    switch(direction) {
      case "up": {
        this.tiles.children.iterate((tile) => {
          this.tweens.add({
              targets: tile,
              y: (tile as GameObjects.Image).y + 75,
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
              y: (tile as GameObjects.Image).y - 75,
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
          x: (this.player as GameObjects.Sprite).x + 75,
          y: (this.player as GameObjects.Sprite).y,
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
          x: (this.player as GameObjects.Sprite).x - 75,
          y: (this.player as GameObjects.Sprite).y,
          duration: 500,
          ease: 'Sine.easeInOut',
          onStart: () => { this.isTweening = true; },
          onComplete: () => { this.isTweening = false; }
        });
      }
    }

    console.log(this.tiles.getChildren().map(g => ({
      x: (g as Phaser.GameObjects.Image | Phaser.GameObjects.Container).x,
      y: (g as Phaser.GameObjects.Image | Phaser.GameObjects.Container).y,
      type: g.type,
      z: (g as Phaser.GameObjects.Image | Phaser.GameObjects.Container).depth
    })))
  }
}

function TravelComponentFactory(texture: string, spaces: number) : {texture: string, spaces: number, type: 'RoadImage'} {
  return { texture, spaces, type: 'RoadImage' };
}