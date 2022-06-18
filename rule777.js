let arrayLim = window.innerWidth;
let size = 1;
let rowLim = window.innerHeight;

const redArr = [];
const blueArr = [];
const greenArr = [];

const arr = [];

const nextRed = [];
const nextBlue = [];
const nextGreen = [];

const nextArr = [];

let col;

let redRule, greenRule, blueRule;

const ruleArr = [];

let left, center, right, ruleset;

let OmChance = 0.9999

let notChance = 0.9999;

let r = Math.floor(Math.random() * 3);

if (r === 1) {
  OmChance = 1;
} else if (r === 2) {
  OmChance = 0.5;
}

r = Math.floor(Math.random() * 3);

if (r === 1) {
  notChance = 1;
} else if (r === 2) {
  notChance = 0.999;
}

var row = 0;

function setup() {
  createCanvas(arrayLim, rowLim);
  background(1);
  noStroke();
  //creates random array
  createArray();

  loadPixels();

  for (let i = 0; i < 3; i++) {
    ruleArr[i] = randomRule();
  }

  ruleset = randomRule();
}

function draw() {
  //sets left, center, right vars
  //if statement here to cause less lag
  if (row < rowLim) {
    // The first and last pixel in each row is going to be white (0).
    for (let i = 0; i < arrayLim - 3; i++) {
      left = i;
      center = i + 1;
      right = i + 2;

      for (let k = 0; k < 3; k++) {
        r = Math.random();
        if (r >= OmChance) {
          ruleArr[i] = randomRule();
        }
      }

      generate(left, center, right);
      set(center, row, col);  
    }

    updatePixels();  
  }

  // This copies the array (this is necessary if using const array).

  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < arrayLim - 1; k++) {
      arr[i][k] = nextArr[i][k];
    }
  }

  row += size;
  //goes back to top
}

/* Deprecated
function createArray(array, rand) {
  for (let i = 0; i < arrayLim; i++) {

    if (rand) {

      r = Math.random();
      
      array[i] = 0;
      
      if (r >= 0.5) {
        array[i] = 1;
      }
    }
  }
}*/

function createArray() {
  const insert = [];
  for (let i = 0; i < 3; i++) {
    insert.length = 0;
    for (let k = 0; k < arrayLim; k++) {
      r = Math.random();
      insert[k] = 0;
      if (r >= 0.5) {
        insert[k] = 1;
      }
    }
    arr[i] = insert;
  }
}

function randomRule() {
  let binString, count, reverse;
  const rSet = [];
  binString = "";
  for (let i = 0; i < 8; i++) {
    r = Math.round(Math.random());
    binString += r;
  }

  check = 0;

  r = Math.random();
  if (r >= OmChance) {
    check = 1;
  }

  while ((parseInt(binString, 2) % 2) === check) {
    binString = "";
    for (let i = 0; i < 7; i++) {
      r = Math.round(Math.random());
      binString += r;
    }
  }

  count = 1;
  reverse = binString.split('').reverse().join('');
  for (let i in reverse) {
    if (parseInt(reverse[i]) === 1) {
      rSet.push(count);
    }

    count += 1;
  }

  if (parseInt(binString, 2) === 0) {
    rSet.push(0);
  }

  return rSet;
}

function generate(left, center, right) {
  //checks at array location and sets color

  let re = rule(0, left, center, right, ruleArr[0]);
  let g = rule(1, left, center, right, ruleArr[1]);
  let b = rule(2, left, center, right, ruleArr[2]);

  col = color(re, g, b);

  r = Math.random();
    
  if (r >= OmChance) {
    ruleset = randomRule();
  }

  const insert = [];
  for (let i = 0; i < 3; i++) {
    insert.length = 0;
    if (left === 0) {
      insert[left] = 0;
    } else if (right === arrayLim - 1) {
      insert[right] = 0;
    } else {
      insert[center] = rule(i, left, center, right, ruleset);

      r = Math.random();
      if (r >= notChance) {
        insert[center] = (insert[center] === 1) ? 0 : 1;
      }
    }

    nextArr[i] = insert;
  }
}

function rule(index, left, center, right, ruleset) {
  //0 is white, 1 is black

  // This is a string template that outputs something like "101" or "111".
  string = `${arr[index][left]}${arr[index][center]}${arr[index][right]}`;

  // parseInt returns the integer equivalent of a string. 2 is the base. Returns a decimal number for binary strings.
  dec = parseInt(string, 2);



  // 110 = [3, 4, 5, 7]

  if (ruleset.includes(dec)) {
    return 1;
  }

  return 0;
}
