class Obstacle {
  constructor(width,hallwayWidth) {
    this.start = createVector(-hallwayWidth,-50);
    this.end = createVector(this.start.x+width,-50);
  }

  draw() {
    stroke(0);
    line(this.start.x,this.start.y,this.end.x,this.end.y);
  }
}
