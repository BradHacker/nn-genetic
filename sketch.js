/*
Original nn code

function setup() {
  // Define amount of training and the trianing data
  let trainAmount = 1000;
  let training_data = [
    {
      inputs: [0,1],
      targets: [1]
    },
    {
      inputs: [1,0],
      targets: [1]
    },
    {
      inputs: [1,1],
      targets: [0]
    },
    {
      inputs: [0,0],
      targets: [0]
    }
  ];
  // Define Neural Network
  let nn = new NeuralNetwork(2, 2, 1, false);

  // Run training with training data
  for(let i = 0; i < trainAmount; i++) {
    let data = random(training_data);
    nn.train(data.inputs,data.targets);
  }

  // Log Neural Network output to respective values
  console.log(nn.feedForward([1,0]));
  console.log(nn.feedForward([0,1]));
  console.log(nn.feedForward([0,0]));
  console.log(nn.feedForward([1,1]));
}
*/

let population = [];
let populationSize = 50;
let matingPool = [];

let hallwayWidth = 100;
let hallwayLength = 200;

let target;

let lifeCounter = 0;
let lifetime = hallwayWidth + hallwayLength;

let mutationRate = .01;

function setup() {
  createCanvas(windowWidth,windowHeight);

  for(let i = 0; i < populationSize; i++) {
    population.push(new Mover(hallwayLength));
  }

  target = new Target(0,-(hallwayLength - 20),15);
}

function draw() {
  background(255);
  translate(width/2,height/2);

  if(lifeCounter < lifetime) {
    movePopulation();

    drawScreen();

    lifeCounter ++;
  } else {
    for(let i = 0; i < population.length; i++) {
      population[i].calcFitness(target);
    }
    selection();
    reproduction();

    lifeCounter = 0;
  }
}

function drawScreen() {
  //draw walls
  stroke(0);
  line(-hallwayWidth, -hallwayLength, -hallwayWidth, hallwayLength);
  line(hallwayWidth, -hallwayLength, hallwayWidth, hallwayLength);
  line(-hallwayWidth, -hallwayLength, hallwayWidth, -hallwayLength);
  line(-hallwayWidth, hallwayLength, hallwayWidth, hallwayLength);

  //draw target
  target.draw();

  //draw population
  for(let i = 0; i < population.length; i++) {
    population[i].draw();
  }

  //draw lifeCounter
  text((lifetime-lifeCounter),-hallwayWidth,-hallwayLength-12);
}

function movePopulation() {
  for(let i = 0; i < population.length; i++) {
    let mover = population[i];
    let inputs = [mover.leftDistance,mover.rightDistance,mover.forwardDistance,mover.backwardDistance,target.distanceTo(mover)];
    let output = population[i].nn.feedForward(inputs);

    population[i].update(createVector(output[0],output[1]),target);
  }
}

function selection() {
  for (let i = 0; i < population.length; i++) {
    let n = int(population[i].fitness * 10000);
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

      let child = parentA.crossover(parentB);
      child.mutate(mutationRate);

      population[i] = child;
    }
}
