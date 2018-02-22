class Mover {
  constructor(hallwayWidth, hallwayLength) {
    this.hallwayLength = hallwayLength;
    this.hallwayWidth = hallwayWidth;
    this.location = createVector(0,hallwayLength);
    this.size = 10;
    this.leftDistance = 20;
    this.rightDistance = 20;
    this.forwardDistance = 20;
    this.backwardDistance = 20;
    this.nn = new NeuralNetwork(5,4,2);
    this.dna;
    this.fitness = 0;
    this.timeAlive = 0;
    this.alive = true;
    this.reachedTarget = false;
  }

  draw() {
    fill(0);
    ellipse(this.location.x, this.location.y, this.size, this.size);

    stroke(0,80)
    //stroke(0, this.calcAlpha(this.leftDistance,400));
    line(this.location.x, this.location.y, this.location.x-this.leftDistance, this.location.y);
    //stroke(0, this.calcAlpha(this.rightDistance,400));
    line(this.location.x, this.location.y, this.location.x+this.rightDistance, this.location.y);
    //stroke(0, this.calcAlpha(this.forwardDistance,600));
    line(this.location.x, this.location.y, this.location.x, this.location.y-this.forwardDistance);
    //stroke(0, this.calcAlpha(this.backwardDistance,600));
    line(this.location.x, this.location.y, this.location.x, this.location.y+this.backwardDistance);
  }

  update(newLocation, target) {
    if(this.alive && !this.reachedTarget) {
      newLocation.normalize();
      this.location.add(newLocation);

      this.leftDistance = Math.abs(-hallwayWidth-this.location.x);
      this.rightDistance = Math.abs(hallwayWidth-this.location.x);
      this.forwardDistance = Math.abs(-hallwayLength-this.location.y);
      this.backwardDistance = Math.abs(hallwayLength-this.location.y);

      let x = this.location.x;
      let y = this.location.y;
      let s = this.size/2;
      if(x - s < -hallwayWidth || x + s > hallwayWidth || y - s < -hallwayLength || y + s > hallwayLength) {
        this.alive = false;
        //console.log(this.timeAlive)
      }

      if(target.distanceTo(this) <= s + target.size/2) {
        this.reachedTarget = true;
      }
      this.timeAlive += 1;
    }
  }

  calcFitness(target) {
    this.fitness = 1/(this.leftDistance + this.rightDistance + this.forwardDistance + this.backwardDistance - target.distanceTo(this.location));
    if(!this.alive) {
      this.fitness *= 0.08;
    }
    if(this.reachedTarget) {
      this.fitness *= 3;
    }
  }

  crossover(partner) {
    let child = new Mover(this.hallwayWidth,this.hallwayLength);

    //select random vals form parents for weights_ih
    for(let i = 0; i < this.nn.weights_ih.data.length; i++) {
      for(let j = 0; j < this.nn.weights_ih.data[i].length; j++) {
        if(random(0,2) < 1) {
          child.nn.weights_ih.data[i][j] = this.nn.weights_ih.data[i][j];
        } else {
          child.nn.weights_ih.data[i][j] = partner.nn.weights_ih.data[i][j];
        }
      }
    }

    //select random vals form parents for bias_h
    for(let i = 0; i < this.nn.bias_h.data.length; i++) {
      for(let j = 0; j < this.nn.bias_h.data[i].length; j++) {
        if(random(0,2) < 1) {
          child.nn.bias_h.data[i][j] = this.nn.bias_h.data[i][j];
        } else {
          child.nn.bias_h.data[i][j] = partner.nn.bias_h.data[i][j];
        }
      }
    }

    //select random vals form parents for weights_ho
    for(let i = 0; i < this.nn.weights_ho.data.length; i++) {
      for(let j = 0; j < this.nn.weights_ho.data[i].length; j++) {
        if(random(0,2) < 1) {
          child.nn.weights_ho.data[i][j] = this.nn.weights_ho.data[i][j];
        } else {
          child.nn.weights_ho.data[i][j] = partner.nn.weights_ho.data[i][j];
        }
      }
    }

    //select random vals form parents for bias_o
    for(let i = 0; i < this.nn.bias_o.data.length; i++) {
      for(let j = 0; j < this.nn.bias_o.data[i].length; j++) {
        if(random(0,2) < 1) {
          child.nn.bias_o.data[i][j] = this.nn.bias_o.data[i][j];
        } else {
          child.nn.bias_o.data[i][j] = partner.nn.bias_o.data[i][j];
        }
      }
    }

    return child;
  }

  mutate(mutationRate) {
    //select random vals form parents for weights_ih
    for(let i = 0; i < this.nn.weights_ih.data.length; i++) {
      for(let j = 0; j < this.nn.weights_ih.data[i].length; j++) {
        if(random(0,1) < mutationRate) {
          this.nn.weights_ih.data[i][j] = Math.random();
          if(Math.random() < 0.5) {
            this.nn.weights_ih.data[i][j] *= -1;
          }
        }
      }
    }

    //select random vals form parents for bias_h
    for(let i = 0; i < this.nn.bias_h.data.length; i++) {
      for(let j = 0; j < this.nn.bias_h.data[i].length; j++) {
        if(random(0,1) < mutationRate) {
          this.nn.bias_h.data[i][j] = Math.random();
          if(Math.random() < 0.5) {
            this.nn.bias_h.data[i][j] *= -1;
          }
        }
      }
    }

    //select random vals form parents for weights_ho
    for(let i = 0; i < this.nn.weights_ho.data.length; i++) {
      for(let j = 0; j < this.nn.weights_ho.data[i].length; j++) {
        if(random(0,1) < mutationRate) {
          this.nn.weights_ho.data[i][j] = Math.random();
          if(Math.random() < 0.5) {
            this.nn.weights_ho.data[i][j] *= -1;
          }
        }
      }
    }

    //select random vals form parents for bias_o
    for(let i = 0; i < this.nn.bias_o.data.length; i++) {
      for(let j = 0; j < this.nn.bias_o.data[i].length; j++) {
        if(random(0,1) < mutationRate) {
          this.nn.bias_o.data[i][j] = Math.random();
          if(Math.random() < 0.5) {
            this.nn.bias_o.data[i][j] *= -1;
          }
        }
      }
    }
  }

  calcAlpha(distance,max) {
    if(distance > 250) {
      console.log(max)
    }
    return (-160/max*2) * distance + 160;
  }
}
