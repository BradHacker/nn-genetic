let population = [];
let populationSize = 40;
let matingPool = [];

let hallwayWidth = 80;
let hallwayLength = 250;

let target;
let obstacle;

let obstacleWidth = hallwayWidth;

let lifeCounter = 0;
let lifetime;
let genCount = 1;

let mutationRate = .0005;

/*
Crossover Types -
0 - Random
1 - Midpoint
*/
let crossoverType = 0;
let crossoverTypeText = "";
let avgFitness = 0;
let totalReachedTarget = 0;

let optimalMover;

function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);
  console.log(getFrameRate())

  lifetime = floor((hallwayWidth + hallwayLength)*1.1)

  for(let i = 0; i < populationSize; i++) {
    population.push(new Mover(hallwayWidth, hallwayLength, 300));
  }

  target = new Target(0,-(hallwayLength - 20),15);
  obstacle = new Obstacle(obstacleWidth,hallwayWidth);
}

function draw() {
  background(255);
  translate(width/2,height/2);

  if(lifeCounter < lifetime) {
    movePopulation();

    drawScreen();

    lifeCounter ++;
  } else {
    let totalFitness = 0;
    totalReachedTarget = 0;
    for(let i = 0; i < population.length; i++) {
      population[i].calcFitness(target);
      totalFitness += population[i].fitness;
      if(population[i].reachedTarget) {
        totalReachedTarget++;
      }
    }

    let populationCopy = population;
    populationCopy.sort(function(a, b) {
      return b.fitness - a.fitness;
    });

    if(optimalMover == undefined) {
      optimalMover = populationCopy[0];
    }

    if(population[0].fitness > optimalMover.fitness) {
      optimalMover = populationCopy[0];
    }

    avgFitness = totalFitness/population.length;
    selection();
    reproduction();

    lifeCounter = 0;
    genCount++;
  }
}

function drawScreen() {
  //draw population
  for(let i = 0; i < population.length; i++) {
    population[i].draw();
  }

  //draw walls
  stroke(0);
  line(-hallwayWidth, -hallwayLength, -hallwayWidth, hallwayLength);
  line(hallwayWidth, -hallwayLength, hallwayWidth, hallwayLength);
  line(-hallwayWidth, -hallwayLength, hallwayWidth, -hallwayLength);
  line(-hallwayWidth, hallwayLength, hallwayWidth, hallwayLength);

  //draw target
  target.draw();

  //draw obstacle
  obstacle.draw();

  //gen crossover type text
  if(crossoverType == 0) {
    crossoverTypeText = "Random";
  } else if(crossoverType == 1) {
    crossoverTypeText = "Midpoint";
  } else {
    crossoverTypeText = "Error";
  }

  fill(0);
  noStroke();

  //draw info
  text("Time Left In Gen: " + (lifetime-lifeCounter),-hallwayWidth,-hallwayLength-1);
  text("Gen Count: " + genCount,-hallwayWidth,-hallwayLength-16);
  text("Mutation Rate: " + (mutationRate*100).toFixed(2) + "%",-hallwayWidth,-hallwayLength-31);
  text("Crossover Type: " + crossoverTypeText,-hallwayWidth,-hallwayLength-46);
  text("Avg Fitness: " + avgFitness.toFixed(4),-hallwayWidth,-hallwayLength-61);
  text("Reached Target: " + totalReachedTarget + "/" + population.length,-hallwayWidth,-hallwayLength-76);

  //draw optimal mover info
  if(optimalMover) {
    translate(-optimalMover.nn.weights_ih.cols*70,-hallwayLength)
    text("Highest Performing Mover", 0, -60)
    strokeWeight(1);
    stroke(0);
    line(0, -59, textWidth("Highest Performing Mover"), -59)
    noStroke();
    if(!optimalMover.alive) {
      text("time before death", 0, -30)
    } else {
      if(optimalMover.reachedTarget) {
        text("time taken to reach target", 0, -30)
      } else {
        text("time alive", 0, -30)
      }
    }
    text(optimalMover.timeAlive, 0, -15)
    text("fitness", 0, 15)
    text(optimalMover.fitness, 0, 30)
    text("weights_ih", 0, 60)
    optimalMover.nn.weights_ih.draw(0,75);
    text("bias_h", 0, 75 + (15*(optimalMover.nn.weights_ih.rows+1)))
    optimalMover.nn.bias_h.draw(0,75 + (15*(optimalMover.nn.weights_ih.rows+2)))
    text("weights_ho", 0, 75 + (15*(optimalMover.nn.weights_ih.rows+2))+(15*(optimalMover.nn.bias_h.rows+1)))
    optimalMover.nn.weights_ho.draw(0,75 + (15*(optimalMover.nn.weights_ih.rows+2))+(15*(optimalMover.nn.bias_h.rows+2)))
    text("bias_o", 0, 75 + (15*(optimalMover.nn.weights_ih.rows+2))+(15*(optimalMover.nn.bias_h.rows+2))+(15*(optimalMover.nn.weights_ho.rows+1)))
    optimalMover.nn.bias_o.draw(0,75 + (15*(optimalMover.nn.weights_ih.rows+2))+(15*(optimalMover.nn.bias_h.rows+2))+(15*(optimalMover.nn.weights_ho.rows+2)))
  }
}

function movePopulation() {
  for(let i = 0; i < population.length; i++) {
    let mover = population[i];
    let inputs = [mover.leftDistance,mover.rightDistance,mover.forwardDistance,mover.backwardDistance,mover.distanceTo(target),mover.headingTo(target)];
    let output = population[i].nn.feedForward(inputs);

    population[i].update(createVector(output[0],output[1]),target,obstacle);
  }
}

function selection() {
  for (let i = 0; i < population.length; i++) {
    let n = Math.round(population[i].fitness * 10);
    for (let j = 0; j < n; j++) {
      matingPool.push(population[i]);
    }
  }
}

function reproduction() {
  for (let i = 0; i < population.length; i++) {
    let a = int(random(matingPool.length));
    let b = int(random(matingPool.length));

    parentA = matingPool[a];
    parentB = matingPool[b];

    let child;
    if(crossoverType == 0) {
      child = parentA.crossover(parentB);
    } else if(crossoverType == 1) {
      child = parentA.crossoverMidpoint(parentB);
    } else {
      alert("incorrect crossover type")
    }
    child.mutate(mutationRate);

    population[i] = child;
  }
}
