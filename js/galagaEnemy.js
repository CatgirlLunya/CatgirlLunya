const getSpriteCoords = function(xi, yi) {
  return {x: xi * 18 + 1, y: yi * 18 + 1};
}

const getSprites = function(yi, idle_anim) {
  return {
    'W': getSpriteCoords(0, yi),
    'NWW': getSpriteCoords(1, yi),
    'NW1': getSpriteCoords(2, yi),
    'NW2': getSpriteCoords(3, yi),
    'NNW1': getSpriteCoords(4, yi),
    'NNW2': getSpriteCoords(5, yi),
    'N1': getSpriteCoords(6, yi),
    'N2': idle_anim ? getSpriteCoords(7, yi) : getSpriteCoords(6, yi),
  }
}

enemySpriteCoords = {
  'galaga': getSprites(2, true),
  'hit_galaga': getSprites(3, true),
  'red_bug': getSprites(4, true),
  'blue_bug': getSprites(5, true),
  'orange_bug': getSprites(6, false),
  'green_bug': getSprites(7, false),
  'yellow_bug': getSprites(8, false),
  'player': getSprites(0, false),
}

let spritesheet = new Image();
spritesheet.src = "img/galagaSpritesheet.png"

const rotationHelper = function(rotation, targetRotation) {
  return (targetRotation - 90 / 8 <= (rotation % 360) && (rotation % 360) < targetRotation + 90 / 8);
}

const enemySize = 48;
const Enemy = class {
  x;
  y;
  dx;
  dy;
  type;
  initial_angle;
  rotation;
  frame;
  time = 0;
  constant_speed;
  speed;
  path;
  plan;
  index = 0;

  constructor(x, y, type, angle, base_speed, plan) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.type = type;
    this.initial_angle = angle; // 0 is ->, so 180 is down
    this.rotation = this.initial_angle;
    this.frame = 0;
    this.time = 0;
    this.path = new StraightPath(300, this.initial_angle);
    this.constant_speed = base_speed;
    this.speed = this.constant_speed;
    this.plan = plan;
  }

  render() {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const x = this.x + this.dx;
    const y = this.y + this.dy;

    let dir;
    const semi_rotation = this.rotation % 90;
    const quadrant = Math.floor(this.rotation / 90) % 4;
    ctx.translate(x + enemySize/2,y + enemySize/2);
    if (quadrant === 0) {
      ctx.rotate(90 * Math.PI / 180);
    } else if (quadrant === 2) {
      ctx.rotate(3 * Math.PI / 2);
    } else if (quadrant === 3) {
      ctx.rotate(2 * Math.PI / 2);
    }
    ctx.translate(-x - enemySize/2,-y - enemySize/2);
    if (rotationHelper(semi_rotation, 0)) {
      dir = 'N';
    } else if (rotationHelper(semi_rotation, 90/4)) {
      dir = 'NNW'
    } else if (rotationHelper(semi_rotation, 90/2)) {
      dir = 'NW';
    } else if (rotationHelper(semi_rotation, 3 * 90/4)) {
      dir = 'NWW';
    } else {
      dir = 'W';
    }


    let hasAnim = dir + '1' in enemySpriteCoords[this.type];
    let coords;
    if (hasAnim) {
      if (this.frame % 60 < 30) coords = enemySpriteCoords[this.type][dir + '1'];
      else coords = enemySpriteCoords[this.type][dir + '2'];
    } else {
      coords = enemySpriteCoords[this.type][dir];
    }
    ctx.drawImage(spritesheet, coords.x, coords.y, 16, 16, x, y, enemySize, enemySize);
    ctx.restore();
  }

  shoot() {
    new Audio("aud/shootsfx.mp3").play();
  }

  update() {
    const pos = this.path.getPos(this.time);
    this.dx = pos.x;
    this.dy = -pos.y;
    this.frame++;
    this.time += this.speed / 250;
    if (this.time >= 1) {
      this.time = 0;
      this.x += this.dx;
      this.dx = 0;
      this.y += this.dy;
      this.dy = 0;

      if (this.plan[this.index++] === 0 && this.path instanceof StraightPath) {
        this.path = new CirclePath( 100, this.initial_angle - 90);
        this.speed = this.constant_speed / (Math.PI);
      } else {
        this.speed = this.constant_speed;
        this.path = new StraightPath(200, this.initial_angle);
      }
    }

    this.rotation = this.path.getRotation(this.time);

    if (this.y >= getHeight() + enemySize || this.y < -enemySize || this.x < enemySize || this.x > getWidth() + enemySize) enemies.splice(enemies.indexOf(this), 1);
  }
}

enemies = [];

const updateEnemies = function () {
  enemies.forEach((enemy) =>{
    enemy.update();
  })
}

const renderEnemies = function () {
  enemies.forEach((enemy) =>{
    enemy.render();
  })
}

const makeRandomPlan = function () {
  let plan = [];
  for (let i = 0; i < 10; i++) {
    if (Math.random() < 0.1) {
      plan.push(0);
    } else {
      plan.push(1);
    }
  }
  return plan;
}

const spawnEnemy = function () {
  let x, y, angle;
  if (Math.random() < 0.9) { // comes in from left
    angle = 90 + Math.random() * 30 - 15;
    x = -enemySize;
    y = (getHeight() / 2) * Math.random() + (getHeight() / 4);
  } else if (Math.random() < 0.5) { // from top
    angle = 180 + Math.random() * 30 - 15;
    y = -enemySize;
    x = getWidth() / 2 * Math.random() + getWidth() / 4;
  } else if (Math.random() < 0.75) { // from right
    angle = 90 + Math.random() * 30 - 15;
    x = getWidth() + enemySize;
    y = getHeight() / 2 * Math.random() + getHeight() / 4;
  } else { // from bottom
    angle = Math.random() * 30 - 15;
    y = getHeight() + enemySize;
    x = getWidth() / 2 * Math.random() + getWidth() / 4;
  }
  const types = ['galaga', 'hit_galaga', 'red_bug', 'yellow_bug', 'blue_bug', 'green_bug', 'orange_bug'];
  const type = types[Math.floor(types.length * Math.random())];
  enemies.push(new Enemy(x, y, type, angle+90, Math.random() * 3 + 7.5, makeRandomPlan()));
}

const spawnSquadron = function () {
  let x, y, angle;
  if (Math.random() < 0.25) { // comes in from left
    angle = 270;
    x = -enemySize;
    y = (getHeight() / 2) * Math.random() + (getHeight() / 4);
  } else if (Math.random() < 0.5) { // from top
    angle = 180;
    y = -enemySize;
    x = getWidth() / 2 * Math.random() + getWidth() / 4;
  } else if (Math.random() < 0.75) { // from right
    angle = 90;
    x = getWidth() + enemySize;
    y = getHeight() / 2 * Math.random() + getHeight() / 4;
  } else { // from bottom
    angle = 0;
    y = getHeight() + enemySize;
    x = getWidth() / 2 * Math.random() + getWidth() / 4;
  }

  const types = ['galaga', 'hit_galaga', 'red_bug', 'yellow_bug', 'blue_bug', 'green_bug', 'orange_bug'];
  const type = types[Math.floor(types.length * Math.random())];

  const speed = Math.random() * 3 + 7.5;
  const plan = makeRandomPlan();
  if (angle === 270 || angle === 90) {
    const dx = (x < 0) ? enemySize : -enemySize;
    enemies.push(new Enemy(x, y + enemySize / 1.5, type, angle + 90, speed, plan));
    enemies.push(new Enemy(x, y - enemySize / 1.5, type, angle + 90, speed, plan));
    enemies.push(new Enemy(x + 3 * dx, y, 'player', angle + 90, speed, plan));
  } else {
    const dy = (y < 0) ? enemySize : -enemySize;
    enemies.push(new Enemy(x + enemySize / 1.5, y, type, angle + 90, speed, plan));
    enemies.push(new Enemy(x - enemySize / 1.5, y, type, angle + 90, speed, plan));
    enemies.push(new Enemy(x, y + 3 * dy, 'player', angle + 90, speed, plan));
  }
}

setInterval(spawnSquadron, 3000);

// spawnEnemy()
