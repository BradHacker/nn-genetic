// The sigmoid function
function sigmoid(x) {
  return (1 / (1 + Math.exp(-x)))*2-1;
}

// The derivative of the sigmoid
function dsigmoid(y) {
  return (y * (1 - y))*2;
}

class NeuralNetwork {
  constructor(numI, numH, numO) {
    this.input_nodes = numI;
    this.hidden_nodes = numH;
    this.output_nodes = numO;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes,1);
    this.bias_o = new Matrix(this.output_nodes,1);
    this.bias_h.randomize();
    this.bias_o.randomize();

    this.learning_constant = 0.1;

    this.total_trainings = 0;
  }

  // This function generates its guess based upon inputs
  feedForward(input_array) {
    // Convert input_array to Matrix
    let inputs = Matrix.fromArray(input_array);

    // Generate hidden layer values
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    // Add bias
    hidden.add(this.bias_h);
    // Apply activation function
    hidden.map(sigmoid);

    // Generating final output
    let output = Matrix.multiply(this.weights_ho, hidden);
    //Add bias
    output.add(this.bias_o);
    // Apply activation function
    output.map(sigmoid);

    // Returning output as an Array
    return output.toArray();
  }

  // This function modifies the weights and bias based upon the expected output using gradient descent
  train(input_array, target_array) {
    // Convert input_array to Matrix
    let inputs = Matrix.fromArray(input_array);

    // Generate hidden layer values
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    // Add bias
    hidden.add(this.bias_h);
    // Apply activation function
    hidden.map(sigmoid);

    // Generating final output
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    // Add bias
    outputs.add(this.bias_o);
    // Apply activation function
    outputs.map(sigmoid);

    // Convert array to matrix
    let targets = Matrix.fromArray(target_array);
    // Calculate output errors
    let output_errors = Matrix.subtract(targets, outputs);

    // Calculate gradient
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_constant);

    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // Adjust weights with deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust bias with gradients
    this.bias_o.add(gradients);

    // Calculate hidden layer error
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_constant);

    // Calculate deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    // Adjust weights with deltas
    this.weights_ih.add(weight_ih_deltas);
    // Adjust bias with gradient
    this.bias_h.add(hidden_gradient);
  }
}
