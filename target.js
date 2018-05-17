class Target {
  constructor(x,y,s) {
    this.location = createVector(x,y);
    this.size = s;
  }

  draw() {
    noStroke();
    fill(0);
    ellipse(this.location.x,this.location.y,this.size,this.size);
  }

  distanceTo(location) {
    return p5.Vector.dist(this.location,location);
  }
}
