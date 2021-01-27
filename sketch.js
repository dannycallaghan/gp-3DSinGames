let confLocs = []; // Stores the location of each piece of confetti
let confTheta = []; // Stores the initial angle of each piece of confetti
const numOfConfetti = 300; // Number of confetti pieces
const zoomRatio = 1.4; // Sets the zoom factor
const materials = {
  boxes: {
    rendered: false,
    selected: 'specular'
  },
  confetti: {
    confetti: false,
    selected: 'specular'
  }
};
let font;

function preload () {
  font = loadFont('./assets/ArialBlack.ttf');
}


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

  // Boxes material selector
  createBoxMaterialSelect(10, 20, 'boxes');

  // Confetti material selector
  createBoxMaterialSelect(630, 20, 'confetti');
  
  push();

  // Camera
  rotateCamera();

  // Boxes
  drawBoxes();
  
  // Confetti
  confetti();

  pop();

  
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


function getMaterial (item) {
  switch(materials[item].selected) {
    case 'ambient':
      ambientLight(color(materials[item].lightPicker.color()));
      ambientMaterial(color(materials[item].colorPicker.color()));
    break;
    case 'emissive':
      emissiveMaterial(color(materials[item].colorPicker.color()));
    break;
    case 'specular':
      shininess(80);
      ambientLight(100);
      specularColor(0, 255, 0);
      pointLight(255, 255, 255, mouseX - height / 2, mouseY - width / 2, 100);
      specularMaterial(250);
    break;
    default:
      normalMaterial();
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
    const material = getMaterial('boxes');
    // TODO - Say why this is commented out
    // normalMaterial();
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
    const material = getMaterial('confetti');
    // TODO - Say why this is commented out
    //normalMaterial();
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

function createBoxMaterialSelect (x, y, item) {
  
  push();
  translate(-width / 2, -height / 2);
  textFont(font);
  textAlign(RIGHT);
  fill(255);
  textSize(16);
  noStroke();
  text(`${item} material:`, x + 130, y);
  if (materials[item].selected === 'ambient' || materials[item].selected === 'emissive') {
    text(`object colour:`, x + 130, y + 28);
  }
  if (materials[item].selected === 'specular') {
    push();
    textSize(14);
    text(`move your mouse to affect the light position`, x + 130, y + 28);
    pop();
  }
  if (materials[item].selected === 'ambient') {
    text(`light colour:`, x + 130, y + 56);
  }
  textAlign(CENTER);
  if (!materials[item].rendered) {
    const sel = createSelect();
    sel.position(x + 134, y - 15);
    sel.option('normal');
    sel.option('ambient');
    sel.option('emissive');
    sel.option('specular');
    sel.selected(materials[item].selected);
    sel.changed(() => materialSelectEvent(sel, item));
    materials[item].colorPicker = createColorPicker('#18ef50');
    materials[item].lightPicker = createColorPicker('#ffffff');
    materials[item].rendered = true;
  } else {
    if (materials[item].selected === 'ambient' || materials[item].selected === 'emissive') {
      materials[item].colorPicker.position(x + 134, y + 8);
    } else {
      materials[item].colorPicker.position(x + 134, -3000);
    }
    if (materials[item].selected === 'ambient') {
      materials[item].lightPicker.position(x + 134, y + 38);
    } else {
      materials[item].lightPicker.position(x + 134, -3000);
    }
  }
  pop();
}

function materialSelectEvent (select, item) {
  const value = select.value();
  materials[item].selected = value;
}
