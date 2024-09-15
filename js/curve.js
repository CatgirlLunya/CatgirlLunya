const Path = class {
  getPos(time) {}

  getRotation(time) {}
}

const CirclePath = class extends Path {
  radius;
  initialAngle;

  constructor(radius, initialAngle) {
    super();
    this.radius = radius;
    this.initialAngle = initialAngle;
  }

  getRotation(time) {
    // console.log(time);
    // console.log(time * 360);
    return (this.initialAngle + time * 360 + 90) % 360;
  }

  getPos(time) {
    return {'x': this.radius * (Math.cos((this.getRotation(time) - 90) / 180 * Math.PI) - Math.cos(this.initialAngle / 180 * Math.PI)), 'y': this.radius * (Math.sin((this.getRotation(time) - 90) / 180 * Math.PI) - Math.sin(this.initialAngle / 180 * Math.PI))};
  }
}

const StraightPath = class extends Path {
  length;
  angle;

  constructor(length, angle) {
    super();
    this.length = length;
    this.angle = angle;
  }

  getRotation(time) {
    return this.angle;
  }

  getPos(time) {
    return {'x': this.length * time * Math.cos(Math.PI / 180 * this.angle), 'y': this.length * time * Math.sin(Math.PI / 180 * this.angle)};
  }
}
