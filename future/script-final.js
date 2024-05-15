class Game {
  constructor() {
    // DOM elements
    this.canvas = document.querySelector('#gameplay');
    this.counterDOM = document.getElementById('counter');
    this.endDOM = document.getElementById('end');

    // THREE.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2, window.innerWidth / 2,
      window.innerHeight / 2, window.innerHeight / -2,
      0.1, 10000
    );
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: this.canvas
    });
    // Lane settings
    this.laneTypes = ['car', 'truck', 'forest'];
    this.laneSpeeds = [2, 2.5, 3];
    this.carColors = [0x428eff, 0xffef42, 0xff7b42, 0xff426b];
    this.threeHeights = [20, 45, 60];
    
    // Camera settings
    this.distance = 500;
    this.zoom = 2;
    this.camera.rotation.x = 50 * Math.PI / 180;
    this.camera.rotation.y = 20 * Math.PI / 180;
    this.camera.rotation.z = 10 * Math.PI / 180;
    this.initialCameraPositionY = -Math.tan(this.camera.rotation.x) * this.distance;
    this.initialCameraPositionX = Math.tan(this.camera.rotation.y) * Math.sqrt(this.distance ** 2 + this.initialCameraPositionY ** 2);
    this.camera.position.y = this.initialCameraPositionY;
    this.camera.position.x = this.initialCameraPositionX;
    this.camera.position.z = this.distance;
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();

    // Renderer settings
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Game settings
    this.chicken = this.Chicken();
    this.chickenSize = 15;
    this.positionWidth = 42;
    this.columns = 17;
    this.boardWidth = this.positionWidth * this.columns;
    this.stepTime = 200;

    // Game state
    this.currentLane = 0;
    this.currentColumn = Math.floor(this.columns / 2);
    this.gameOver = false;
    this.startMoving = false;
    this.moves = [];
    this.stepStartTimestamp = null;
    this.previousTimestamp = null;

    // Textures
    this.textures = {
      car: {
        front: this.Texture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]),
        back: this.Texture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]),
        right: this.Texture(110, 40, [{ x: 10, y: 0, w: 50, h: 30 }, { x: 70, y: 0, w: 30, h: 30 }]),
        left: this.Texture(110, 40, [{ x: 10, y: 10, w: 50, h: 30 }, { x: 70, y: 10, w: 30, h: 30 }])
      },
      truck: {
        front: this.Texture(30, 30, [{ x: 15, y: 0, w: 10, h: 30 }]),
        right: this.Texture(25, 30, [{ x: 0, y: 15, w: 10, h: 10 }]),
        left: this.Texture(25, 30, [{ x: 0, y: 5, w: 10, h: 10 }])
      }
    };
    
    
    // Initial positions
    this.chicken.position.x = 0;
    this.chicken.position.y = 0;
    this.lanes = this.generateLanes();
    // Animation loop
    this.animate = (timestamp) => {
      // console.log('frame');
      // requestAnimationFrame(this.animate);

      if (this.previousTimestamp === null) {
        this.previousTimestamp = timestamp;
      }

      const delta = timestamp - this.previousTimestamp;
      this.previousTimestamp = timestamp;

      // Animate vehicles
      this.lanes.forEach(lane => {
        if (lane.type === 'car' || lane.type === 'truck') {
          const aBitBeforeTheBeginingOfLane = -this.boardWidth * this.zoom / 2 - this.positionWidth * 2 * this.zoom;
          const aBitAfterTheEndOFLane = this.boardWidth * this.zoom / 2 + this.positionWidth * 2 * this.zoom;
          lane.vehicles.forEach(vehicle => {
            if (lane.direction) {
              vehicle.position.x = vehicle.position.x < aBitBeforeTheBeginingOfLane ? aBitAfterTheEndOFLane : vehicle.position.x -= lane.speed / 16 * delta;
            } else {
              vehicle.position.x = vehicle.position.x > aBitAfterTheEndOFLane ? aBitBeforeTheBeginingOfLane : vehicle.position.x += lane.speed / 16 * delta;
            }
          });
        }
      });

      // Handle player movement
      if (this.startMoving) {
        this.stepStartTimestamp = timestamp;
        this.startMoving = false;
      }

      if (this.stepStartTimestamp) {
        const moveDeltaTime = timestamp - this.stepStartTimestamp;
        const moveDeltaDistance = Math.min(moveDeltaTime / this.stepTime, 1) * this.positionWidth * this.zoom;
        const jumpDeltaDistance = Math.sin(Math.min(moveDeltaTime / this.stepTime, 1) * Math.PI) * 8 * this.zoom;
        switch (this.moves[0]) {
          case 'forward': {
            const positionY = this.currentLane * this.positionWidth * this.zoom + moveDeltaDistance;
            this.camera.position.y = this.initialCameraPositionY + positionY;
            this.dirLight.position.y = this.initialDirLightPositionY + positionY;
            this.chicken.position.y = positionY;
            this.chicken.position.z = jumpDeltaDistance;
            break;
          }
          case 'backward': {
            const positionY = this.currentLane * this.positionWidth * this.zoom - moveDeltaDistance;
            this.camera.position.y = this.initialCameraPositionY + positionY;
            this.dirLight.position.y = this.initialDirLightPositionY + positionY;
            this.chicken.position.y = positionY;
            this.chicken.position.z = jumpDeltaDistance;
            break;
          }
          case 'left': {
            const positionX = ((this.currentColumn * this.positionWidth) + (this.positionWidth / 2)) * this.zoom - this.boardWidth * this.zoom / 2 - moveDeltaDistance;
            this.camera.position.x = this.initialCameraPositionX + positionX;
            this.dirLight.position.x = this.initialDirLightPositionX + positionX;
            this.chicken.position.x = positionX;
            this.chicken.position.z = jumpDeltaDistance;
            break;
          }
          case 'right': {
            const positionX = (this.currentColumn * this.positionWidth + this.positionWidth / 2) * this.zoom - this.boardWidth * this.zoom / 2 + moveDeltaDistance;
            this.camera.position.x = this.initialCameraPositionX + positionX;
            this.dirLight.position.x = this.initialDirLightPositionX + positionX;
            this.chicken.position.x = positionX;
            this.chicken.position.z = jumpDeltaDistance;
            break;
          }
        }

        // Handle step completion
        if (moveDeltaTime > this.stepTime) {
          switch (this.moves[0]) {
            case 'forward': {
              this.currentLane++;
              this.counterDOM.innerHTML = this.currentLane;
              break;
            }
            case 'backward': {
              this.currentLane--;
              this.counterDOM.innerHTML = this.currentLane;
              break;
            }
            case 'left': {
              this.currentColumn--;
              break;
            }
            case 'right': {
              this.currentColumn++;
              break;
            }
          }
          this.moves.shift();
          this.stepStartTimestamp = this.moves.length === 0 ? null : timestamp;
        }
      }

      // Hit test
      if (this.lanes[this.currentLane]?.type === 'car' || this.lanes[this.currentLane]?.type === 'truck') {
        const chickenMinX = this.chicken.position.x - this.chickenSize * this.zoom / 2;
        const chickenMaxX = this.chicken.position.x + this.chickenSize * this.zoom / 2;
        const vehicleLength = { car: 60, truck: 105 }[this.lanes[this.currentLane].type];
        this.lanes[this.currentLane].vehicles.forEach(vehicle => {
          const carMinX = vehicle.position.x - vehicleLength * this.zoom / 2;
          const carMaxX = vehicle.position.x + vehicleLength * this.zoom / 2;
          if (chickenMaxX > carMinX && chickenMinX < carMaxX) {
            this.gameOver = true;
            this.endDOM.style.visibility = 'visible';
          }
        });
      }

      // Render the scene
      this.renderer.render(this.scene, this.camera);
    };

    this.init();
  }

  init() {
    this.scene.add(this.chicken);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.scene.add(hemiLight);

    this.setupLighting();
    this.setupEvents();

    // Start the animation loop
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
  
    this.initialDirLightPositionX = -100;
    this.initialDirLightPositionY = -100;


    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.dirLight.position.set(this.initialDirLightPositionX, this.initialDirLightPositionY, 200);
    this.dirLight.castShadow = true;
    this.dirLight.target = this.chicken;
    this.scene.add(this.dirLight);

    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.left = -500;
    this.dirLight.shadow.camera.right = 500;
    this.dirLight.shadow.camera.top = 500;
    this.dirLight.shadow.camera.bottom = -500;

    this.backLight = new THREE.DirectionalLight(0x000000, .4);
    this.backLight.position.set(200, 200, 50);
    this.backLight.castShadow = true;
    this.scene.add(this.backLight);
  }

  setupEvents() {
    document.querySelector("#retry").addEventListener("click", () => {
      lanes.forEach(lane => scene.remove( lane.mesh ));
      initaliseValues();
      endDOM.style.visibility = 'hidden';
    });
    
    document.getElementById('forward').addEventListener("click", () => this.move('forward'));
    
    document.getElementById('backward').addEventListener("click", () => this.move('backward'));
    
    document.getElementById('left').addEventListener("click", () => this.move('left'));
    
    document.getElementById('right').addEventListener("click", () => this.move('right'));

    window.addEventListener("keydown", event => {
      if ((event.keyCode == '38') && (!this.gameOver)) {
        this.move('forward');
      }
      else if ((event.keyCode == '40') && (!this.gameOver)) {
        this.move('backward');
      }
      else if ((event.keyCode == '37') && (!this.gameOver)) {
        this.move('left');
      }
      else if ((event.keyCode == '39') && (!this.gameOver)) {
        this.move('right');
      }
    });
  }

  generateLanes() {
    return generateRange(Math.ceil(window.innerHeight / (this.boardWidth * this.zoom)) + 4).map((index) => {
      const lane = this.Lane(index);
      console.log(lane);
      if (lane.mesh) {
        lane.mesh.position.y = index * this.positionWidth * this.zoom;
        this.scene.add(lane.mesh);
        return lane;
      }
    }).filter((lane) => lane.index >= 0);
  }

  addLane() {
    const index = lanes.length;
    const lane = new Lane(index);
    lane.mesh.position.y = index * this.positionWidth * this.zoom;
    this.scene.add(lane.mesh);
    lanes.push(lane);
  }

  move() {
    const finalPositions = moves.reduce((position, move) => {
      if (move === 'forward') {
          return { lane: position.lane + 1, column: position.column };
      } else if (move === 'backward') {
          return { lane: position.lane - 1, column: position.column };
      } else if (move === 'left') {
          return { lane: position.lane, column: position.column - 1 };
      } else if (move === 'right') {
          return { lane: position.lane, column: position.column + 1 };
      }
    }, { lane: currentLane, column: currentColumn });

    const canMoveForward = direction === 'forward' &&
      this.lanes[finalPositions.lane + 1]?.type !== 'forest' &&
      !this.lanes[finalPositions.lane + 1]?.occupiedPositions.has(finalPositions.column);

    const canMoveBackward = direction === 'backward' &&
      finalPositions.lane > 0 &&
      this.lanes[finalPositions.lane - 1]?.type !== 'forest' &&
      !this.lanes[finalPositions.lane - 1]?.occupiedPositions.has(finalPositions.column);

    const canMoveLeft = direction === 'left' &&
      finalPositions.column > 0 &&
      this.lanes[finalPositions.lane]?.type !== 'forest' &&
      !this.lanes[finalPositions.lane]?.occupiedPositions.has(finalPositions.column - 1);

    const canMoveRight = direction === 'right' &&
      finalPositions.column < columns - 1 &&
      this.lanes[finalPositions.lane]?.type !== 'forest' &&
      !this.lanes[finalPositions.lane]?.occupiedPositions.has(finalPositions.column + 1);

    if (canMoveForward || canMoveBackward || canMoveLeft || canMoveRight) {
      if (!stepStartTimestamp) {
        startMoving = true;
      }
        
      if (direction === 'forward') {
        addLane();
      }
        
      moves.push(direction);
    }
  }

  

  // OBJECTS
  Texture(width, height, rects) {
    const canvas = document.createElement( "canvas" );
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext( "2d" );
    context.fillStyle = "#ffffff";
    context.fillRect( 0, 0, width, height );
    context.fillStyle = "rgba(0,0,0,0.6)";  
    rects.forEach(rect => {
      context.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
    return new THREE.CanvasTexture(canvas);
  }
  
  Wheel() {
    const wheel = new THREE.Mesh( 
      new THREE.BoxBufferGeometry( 12 * this.zoom, 33 * this.zoom, 12 * this.zoom ), 
      new THREE.MeshLambertMaterial( { color: 0x333333, flatShading: true } ) 
    );
    wheel.position.z = 6 * this.zoom;
    return wheel;
  }
  
  Car() {
    const car = new THREE.Group();
    const color = this.carColors[Math.floor(Math.random() * this.carColors.length)];
    
    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(60 * this.zoom, 30 * this.zoom, 15 * this.zoom), 
      new THREE.MeshPhongMaterial({ color, flatShading: true })
    );
    main.position.z = 12 * this.zoom;
    main.castShadow = true;
    main.receiveShadow = true;
    car.add(main);
    
    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 33 * this.zoom, 24 * this.zoom, 12 * this.zoom ), 
      [
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: this.textures.car.back }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: this.textures.car.front }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: this.textures.car.right }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: this.textures.car.left }),
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // top
        new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }) // bottom
      ]
    );
    cabin.position.x = 6 * this.zoom;
    cabin.position.z = 25.5 * this.zoom;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    car.add( cabin );
    
    const frontWheel = this.Wheel();
    frontWheel.position.x = -18 * this.zoom;
    car.add( frontWheel );
  
    const backWheel = this.Wheel();
    backWheel.position.x = 18 * this.zoom;
    car.add( backWheel );
  
    car.castShadow = true;
    car.receiveShadow = false;
    
    return car;  
  }
  
  Truck() {
    const truck = new THREE.Group();
    const color = this.carColors[Math.floor(Math.random() * this.carColors.length)];
  
  
    const base = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 100 * this.zoom, 25 * this.zoom, 5 * this.zoom ), 
      new THREE.MeshLambertMaterial( { color: 0xb4c6fc, flatShading: true } )
    );
    base.position.z = 10 * this.zoom;
    truck.add(base)
  
    const cargo = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 75 * this.zoom, 35 * this.zoom, 40 * this.zoom ), 
      new THREE.MeshPhongMaterial( { color: 0xb4c6fc, flatShading: true } )
    );
    cargo.position.x = 15 * this.zoom;
    cargo.position.z = 30 * this.zoom;
    cargo.castShadow = true;
    cargo.receiveShadow = true;
    truck.add(cargo)
  
    const cabin = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 25 * this.zoom, 30 * this.zoom, 30 * this.zoom ), 
      [
        new THREE.MeshPhongMaterial( { color, flatShading: true } ), // back
        new THREE.MeshPhongMaterial( { color, flatShading: true, map: this.textures.truck.front } ),
        new THREE.MeshPhongMaterial( { color, flatShading: true, map: this.textures.truck.right } ),
        new THREE.MeshPhongMaterial( { color, flatShading: true, map: this.textures.truck.left } ),
        new THREE.MeshPhongMaterial( { color, flatShading: true } ), // top
        new THREE.MeshPhongMaterial( { color, flatShading: true } ) // bottom
      ]
    );
    cabin.position.x = -40 * this.zoom;
    cabin.position.z = 20 * this.zoom;
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    truck.add( cabin );
  
    const frontWheel = this.Wheel();
    frontWheel.position.x = -38 * this.zoom;
    truck.add( frontWheel );
  
    const middleWheel = this.Wheel();
    middleWheel.position.x = -10 * this.zoom;
    truck.add( middleWheel );
  
    const backWheel = this.Wheel();
    backWheel.position.x = 30 * this.zoom;
    truck.add( backWheel );
  
    return truck;  
  }
  
  Three() {
    const three = new THREE.Group();
  
    const trunk = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 15 * this.zoom, 15 * this.zoom, 20 * this.zoom ), 
      new THREE.MeshPhongMaterial( { color: 0x4d2926, flatShading: true } )
    );
    trunk.position.z = 10 * this.zoom;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    three.add(trunk);
  
    let height = this.threeHeights[Math.floor(Math.random() * this.threeHeights.length)];
  
    const crown = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 30 * this.zoom, 30 * this.zoom, height * this.zoom ), 
      new THREE.MeshLambertMaterial( { color: 0x7aa21d, flatShading: true } )
    );
    crown.position.z = (height/2+20) * this.zoom;
    crown.castShadow = true;
    crown.receiveShadow = false;
    three.add(crown);
  
    return three;  
  }
  
  Chicken() {
    const chicken = new THREE.Group();
  
    const body = new THREE.Mesh(
      new THREE.BoxBufferGeometry( this.chickenSize * this.zoom, this.chickenSize * this.zoom, 20 * this.zoom ), 
      new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
    );
    body.position.z = 10 * this.zoom;
    body.castShadow = true;
    body.receiveShadow = true;
    chicken.add(body);
  
    const rowel = new THREE.Mesh(
      new THREE.BoxBufferGeometry( 2 * this.zoom, 4 * this.zoom, 2 * this.zoom ), 
      new THREE.MeshLambertMaterial( { color: 0xF0619A, flatShading: true } )
    );
    rowel.position.z = 21 * this.zoom;
    rowel.castShadow = true;
    rowel.receiveShadow = false;
    chicken.add(rowel);
  
    return chicken;  
  }
  
  Road() {
    const road = new THREE.Group();
  
    const createSection = color => new THREE.Mesh(
      new THREE.PlaneBufferGeometry( this.boardWidth * this.zoom, this.positionWidth * this.zoom ), 
      new THREE.MeshPhongMaterial( { color } )
    );
  
    const middle = createSection(0x454A59);
    middle.receiveShadow = true;
    road.add(middle);
  
    const left = createSection(0x393D49);
    left.position.x = -this.boardWidth * this.zoom;
    road.add(left);
  
    const right = createSection(0x393D49);
    right.position.x = this.boardWidth * this.zoom;
    road.add(right);
  
    return road;
  }
  
  Grass() {
    const grass = new THREE.Group();
  
    const createSection = color => new THREE.Mesh(
      new THREE.BoxBufferGeometry( this.boardWidth * this.zoom, this.positionWidth * this.zoom, 3 * this.zoom ), 
      new THREE.MeshPhongMaterial( { color } )
    );
  
    const middle = createSection(0x55f472);
    middle.receiveShadow = true;
    grass.add(middle);
  
    const left = createSection(0x46c871);
    left.position.x = -this.boardWidth * this.zoom;
    grass.add(left);
  
    const right = createSection(0x46c871);
    right.position.x = this.boardWidth * this.zoom;
    grass.add(right);
  
    grass.position.z = 1.5 * this.zoom;
    return grass;
  }
  
  Lane(index) {
    let type = index <= 0 ? 'field' : this.laneTypes[Math.floor(Math.random() * 3)];
    let mesh;
  
    switch(type) {
      case 'field': {
        type = 'field';
        mesh = this.Grass();
        break;
      }
      case 'forest': {
        mesh = this.Grass();
  
        const occupiedPositions = new Set();
        const trees = [1,2,3,4].map(() => {
          const tree = this.Three();
          let position;
          position = Math.floor(Math.random() * this.columns);
          while (occupiedPositions.has(position)) {
            position = Math.floor(Math.random() * this.columns);
          }
          occupiedPositions.add(position);
          tree.position.x = (position * this.positionWidth + this.positionWidth / 2) * this.zoom - this.boardWidth * this.zoom / 2;
          mesh.add(tree);
          return tree;
        })
        break;
      }
      case 'car' : {
        mesh = this.Road();
        this.direction = Math.random() >= 0.5;
  
        const occupiedPositions = new Set();
        this.vehicles = [1,2,3].map(() => {
          const vehicle = this.Car();
          let position;
          position = Math.floor(Math.random() * this.columns);
          while (occupiedPositions.has(position)) {
            position = Math.floor(Math.random() * this.columns);
          }
          occupiedPositions.add(position);
          vehicle.position.x = (position * this.positionWidth * 2 + this.positionWidth / 2) * this.zoom - this.boardWidth * this.zoom/2;
          if(!this.direction) vehicle.rotation.z = Math.PI;
          mesh.add( vehicle );
          return vehicle;
        })
  
        this.speed = this.laneSpeeds[Math.floor(Math.random() * this.laneSpeeds.length)];
        break;
      }
      case 'truck' : {
        mesh = this.Road();
        this.direction = Math.random() >= 0.5;
  
        const occupiedPositions = new Set();
        this.vehicles = [1,2].map(() => {
          const vehicle = this.Truck();
          let position;
          position = Math.floor(Math.random() * this.columns);
          while (occupiedPositions.has(position)) {
            position = Math.floor(Math.random() * this.columns);
          }
          occupiedPositions.add(position);
          vehicle.position.x = (position * this.positionWidth * 3 + this.positionWidth / 2) * this.zoom - this.boardWidth * this.zoom / 2;
          if(!this.direction) vehicle.rotation.z = Math.PI;
          mesh.add( vehicle );
          return vehicle;
        })
  
        this.speed = this.laneSpeeds[Math.floor(Math.random() * this.laneSpeeds.length)];
        break;
      }
    }
    return { mesh };
  }
}

// OBJECTS



// UTILITIES ---

/**
 * Generates an array of integers from -n to n
 */
function generateRange(n) {
  const result = [];
  for (let i = -n; i <= n; i++) {
    result.push(i);
  }
  return result;
}

const game = new Game();

requestAnimationFrame(game.animate);