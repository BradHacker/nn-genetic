class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = new Array(rows);

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = new Array(cols);
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  static fromArray(arr) {
    let m = new Matrix(arr.length,1);
    for (let i = 0; i < arr.length; i++) {
      m.data[i][0] = arr[i];
    }
    return m;
  }

  static subtract(a, b) {
    let result = new Matrix(a.rows, a.cols);
    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.data[i][j] = a.data[i][j] - b.data[i][j];
      }
    }
    return result;
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = Math.random();
        if(Math.random() < 0.5) {
          this.data[i][j] *= -1;
        }
      }
    }
  }

  add(other) {
    // Are we trying to add a Matrix?7
    if (other instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += other.data[i][j];
        }
      }
    // Or just a single scalar value?
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] += other;
        }
      }
    }
  }

  static multiply(m1, m2) {
    if(m1.cols !== m2.rows) {
      console.log("m1's columns need to be equal to m2's rows.");
      return undefined;
    }

    let result = new Matrix(m1.rows,m2.cols);

    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        let sum = 0;
        for (let k = 0; k < m1.cols; k++) {
          sum+= m1.data[i][k] * m2.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  }

  multiply(n) {
    if(n instanceof Matrix) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n.data[i][j];
        }
      }
    } else {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] *= n;
        }
      }
    }
  }

  map(fn) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = fn(val);
      }
    }
  }

  static map(matrix, fn) {
    let result =  new Matrix(matrix.rows,matrix.cols);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        let val = matrix.data[i][j];
        result.data[i][j] = fn(val);
      }
    }

    return result;
  }

  static transpose(matrix) {
    let result = new Matrix(matrix.cols, matrix.rows);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        result.data[i][j] = matrix.data[j][i];
      }
    }
    return result;
  }

  print() {
    console.table(this.data);
  }

  draw(x,y) {
    for(let i = 0; i < this.rows; i++) {
      let rowText = "[ ";
      for(let j = 0; j < this.cols - 1; j++) {
        rowText += this.data[i][j].toFixed(3) + " , ";
      }
      rowText += this.data[i][this.cols-1].toFixed(3) + " ]"
      text(rowText, x, y+i*15);
    }
  }
}
