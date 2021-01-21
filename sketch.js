let confLocs = []; // Stores the location of each piece of confetti
let confTheta = []; // Stores the initial angle of each piece of confetti
const numOfConfetti = 300; // Number of confetti pieces
const zoomRatio = 1.4; // Sets the zoom factor

/**
 * P5 setup function
 *
 * @return void.
 */
function setup () {
  createCanvas(900, 800, WEBGL);
  angleMode(DEGREES);

  initConfetti();
}

/**
 * P5 draw function
 *
 * @return void.
 */
function draw () {
  background(125);

  // Boxes
  drawBoxes();

  // Camera
  rotateCamera();

  // Confetti
  confetti();
}

/**
 * Initialises each piece of confetti
 *
 * @return void.
 */
function initConfetti () {
  for (let i = 0; i < numOfConfetti; i++) {
    const confetti = createVector(random(-500, 500), random(-800, 0), random(-500, 500));
    confLocs = confLocs.concat([confetti]);
    confTheta = confTheta.concat([random(360)]);
  }
}

/**
 * Renders the boxes to the screen
 *
 * @return void.
 */
function drawBoxes () {
  for (let i = -400; i < 400; i = i + 50) {
    push();
    normalMaterial();
    stroke(0);
    strokeWeight(2);
    translate(i, 0, 0);
    box(50);
    for (let j = -400; j < 400; j = j + 50) {
      // Calculate the height of each box
      const distance = dist(0, 0, i, j) + frameCount;
      const length = map(sin(distance), -1, 1, 100, 300);

      push();
      translate(0, 0, j);
      box(50, length, 50);
      pop();
    }
    pop();
  }
}

/**
 * Rotates the camera around the centre of the stage
 *
 * @return void.
 */
function rotateCamera () {
  const xLoc = cos(frameCount) * (height * zoomRatio);
  const zLoc = sin(frameCount) * (height * zoomRatio);
  camera(xLoc, -600, zLoc, 0, 0, 0, 0, 1, 0);
}

/**
 * Animated the confettu
 *
 * @return void.
 */
function confetti () {
  for (let i = 0, j = confLocs.length; i < j; i++) {
    const v = confLocs[i];
    confLocs[i].set(v.x, v.y + 1, v.z);
    push();
    normalMaterial();
    noStroke();
    translate(v.x, v.y, v.z);
    rotateX(confTheta[i] + (frameCount * 10));
    plane(15, 15);
    pop();
    // If a piece has reached the middle, reset it    
    if (v.y > 0) {
      confLocs[i].set(v.x, -800, v.z);
    }
  }
}
