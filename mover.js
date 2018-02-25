class Mover {
  constructor(hallwayWidth, hallwayLength, lifetime) {
    this.hallwayLength = hallwayLength;
    this.hallwayWidth = hallwayWidth;
    this.location = createVector(0,hallwayLength/2);
    this.size = 10;
    this.leftDistance = 20;
    this.rightDistance = 20;
    this.forwardDistance = 20;
    this.backwardDistance = 20;
    this.nn = new NeuralNetwork(6,4,2);
    this.dna;
    this.fitness = 0;
    this.timeAlive = 0;
    this.alive = true;
    this.reachedTarget = false;
    this.lifetime = lifetime;
  }

  draw() {
    fill(0, 0);
    stroke(0);
    strokeWeight(1);
    ellipse(this.location.x, this.location.y, this.size, this.size);

    stroke(0,60)
    //stroke(0, this.calcAlpha(this.leftDistance,400));
    line(this.location.x, this.location.y, this.location.x-this.leftDistance, this.location.y);
    //stroke(0, this.calcAlpha(this.rightDistance,400));
    line(this.location.x, this.location.y, this.location.x+this.rightDistance, this.location.y);
    //stroke(0, this.calcAlpha(this.forwardDistance,600));
    line(this.location.x, this.location.y, this.location.x, this.location.y-this.forwardDistance);
    //stroke(0, this.calcAlpha(this.backwardDistance,600));
    line(this.location.x, this.location.y, this.location.x, this.location.y+this.backwardDistance);
  }

  update(newLocation, target, obstacle) {
    if(this.alive && !this.reachedTarget) {
      newLocation.normalize();
      this.location.add(newLocation);

      this.leftDistance = Math.abs(-hallwayWidth-this.location.x);
      this.rightDistance = Math.abs(hallwayWidth-this.location.x);
      this.forwardDistance = Math.abs(-hallwayLength-this.location.y);
      this.backwardDistance = Math.abs(hallwayLength-this.location.y);

      let s = this.size/2;
      if(this.location.x > obstacle.start.x && this.location.x - s < obstacle.end.x) {
        if(this.location.y > obstacle.start.y) {
          this.forwardDistance = Math.abs(obstacle.start.y-this.location.y);
        } else {
          this.backwardDistance = Math.abs(obstacle.start.y-this.location.y);
        }
      }

      if(this.leftDistance < s || this.rightDistance < s || this.forwardDistance < s || this.backwardDistance < s) {
        this.alive = false;
        //console.log(this.timeAlive)
      }

      if(this.distanceTo(target) <= s + target.size/2) {
        this.reachedTarget = true;
      }
      this.timeAlive += 1;
    }
  }

  calcFitness(target) {
    let corner = createVector(hallwayWidth-this.size/2,hallwayLength-this.size/2)
    let distanceToCorner = target.distanceTo(corner)
    let distance = (this.distanceTo(target)*3)/distanceToCorner;
    this.fitness = -(1/3) * Math.pow(distance,2) + 4;
    if(!this.alive) {
      this.fitness *= 0.1;
    }
    if(this.reachedTarget) {
      this.fitness *= 4;
      this.lifetime = this.hallwayWidth + this.hallwayLength;
      this.fitness *= (-3/(this.lifetime+(this.lifetime/2))) * this.timeAlive + 3;
    }
  }

  distanceTo(target) {
    return p5.Vector.dist(this.location,target.location);
  }

  headingTo(target) {
    return p5.Vector.sub(this.location,target.location).heading();
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

  crossoverMidpoint(partner) {
    let child = new Mover(this.hallwayWidth,this.hallwayLength);
    let randomMid;

    randomMid = floor(random(0,this.nn.weights_ih.rows*this.nn.weights_ih.cols));
    //console.log(randomMid);
    //select random vals form parents for weights_ih
    for(let i = 0; i < this.nn.weights_ih.data.length; i++) {
      for(let j = 0; j < this.nn.weights_ih.data[i].length; j++) {
        if(this.nn.weights_ih.cols*i + j < randomMid) {
          child.nn.weights_ih.data[i][j] = this.nn.weights_ih.data[i][j];
          //console.log("parentA");
        } else {
          child.nn.weights_ih.data[i][j] = partner.nn.weights_ih.data[i][j];
          //console.log("parentB");
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

    randomMid = floor(random(0,this.nn.weights_ho.rows*this.nn.weights_ho.cols));
    //select random vals form parents for weights_ho
    for(let i = 0; i < this.nn.weights_ho.data.length; i++) {
      for(let j = 0; j < this.nn.weights_ho.data[i].length; j++) {
        if(this.nn.weights_ho.cols*i + j < randomMid) {
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
