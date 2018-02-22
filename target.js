class Target {
  constructor(x,y,s) {
    this.location = createVector(x,y);
    this.size = s;
  }

  draw() {
    noStroke();
    fill(120);
    ellipse(this.location.x,this.location.y,this.size,this.size);
  }

  distanceTo(mover) {
    return p5.Vector.sub(this.location,mover.location).mag()
  }
}
