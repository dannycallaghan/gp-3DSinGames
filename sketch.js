let confLocs = []; // Stores the location of each piece of confetti
let confTheta = []; // Stores the initial angle of each piece of confetti
const numOfConfetti = 300; // Number of confetti pieces
const zoomRatio = 1.4; // Sets the zoom factor
const materials = {
  boxes: {
    rendered: false,
    materialSelectDefault: 'emissive',

    specShininessDefault: 1,
    colorPickerDefault: '#18ef50',
    ambientLightPickerDefault: '#ffffff',
    specColorPickerDefault: '#00ff00',
    specAmbientLightPickerDefault: '#999999',
    specPointLightPickerDefault: {
      levels: [255, 255, 0]
    }
  },
  confetti: {
    confetti: false,
    materialSelectDefault: 'specular',

    specShininessDefault: 1,
    colorPickerDefault: '#18ef50',
    ambientLightPickerDefault: '#ffffff',
    specColorPickerDefault: '#00ff00',
    specAmbientLightPickerDefault: '#999999',
    specPointLightPickerDefault: {
      levels: [255, 255, 0]
    }
  }
};





let font;
let boldFont;

const canvasWidth = 900;
const canvasHeight = 800;


const menuButton = {
  x: 274,
  y: 0,
  width: 26,
  height: canvasHeight
};

const menu = {
  open: true,
  openX: 0,
  closedX: -276
};


function preload () {
  font = loadFont('./assets/Arial.ttf');
  boldFont = loadFont('./assets/ArialBold.ttf');
}


/**
 * P5 setup function
 *
 * @return void.
 */
function setup () {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
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
  
  push();

  // // Camera
  rotateCamera();

  // Boxes
  drawBoxes();
  
  // Confetti
  confetti();

  pop();

  // Draw menu  
  drawMenu();
  
}


function drawMenu () {
  const menuX = menu.open ? menu.openX : menu.closedX;
  const menuText = menu.open ? 'CLOSE MENU' : 'SHOW MENU';
  push();
  // Translate to top left to make things easier
  translate(-width / 2, -height / 2);
  
  noStroke();
  // Menu
  fill(240);
  translate(menuX, 0);
  rect(0, 0, 300, height);
  // Menu border
  fill(0)
  rect(274, 0, 26, height);
  // Title area
  translate(280, 10);
  fill(255, 255, 0);
  // Arrow
  push()
  if (menu.open) {
    translate(12, 24);
    rotate(180);
  } else {
    translate(3, 10);
  }
  triangle(0, 0, 10, 10, 0, 20);
  pop();
  // Text
  push();
  textFont(boldFont);
  textAlign(LEFT);
  fill(255, 255, 0);
  textSize(16);
  noStroke();
  translate(13, 140);
  rotate(-90);
  text(menuText, 0, 0);
  pop();
  pop();
  // Material menu
  drawMaterialMenu();
}


function drawMaterialMenu () {
  const menuX = menu.open ? menu.openX : menu.closedX;
  push();
  noStroke();
  // Translate to top left to make things easier
  translate(-width / 2, -height / 2);
  // Title
  translate(10, 20);
  textFont(boldFont);
  textAlign(LEFT);
  fill(0);
  textSize(14);
  text('MATERIALS', 0, 0);
  // HR
  push();
  stroke(0);
  strokeWeight(1);
  line(0, 10, 240, 10)
  pop();
  // Boxes material selector
  createBoxMaterialSelect(0, 34, 'boxes');
  // Calculate next menus y position
  let yOffset;
  switch (materials.boxes.materialSelect ? materials.boxes.materialSelect.value() : materials.boxes.materialSelectDefault) {
    case 'specular':
      yOffset = 174;
    break;
    case 'normal':
      yOffset = 50;
    break;
    case 'emissive':
      yOffset = 84;
    break;
    default:
      yOffset = 118;
  };
  // HR
  push();
  stroke(160);
  strokeWeight(1);
  line(0, yOffset, 240, yOffset)
  pop();
  // Confetti material selector
  createBoxMaterialSelect(0, yOffset + 24, 'confetti');
  pop();
}


function mousePressed () {
  const menuButtonX = menu.open ? menuButton.x : menuButton.x - 276;
  if (
    mouseX > menuButtonX &&
    mouseX < (menuButtonX+ menuButton.width) &&
    mouseY > menuButton.y &&
    mouseY < (menuButton.y + menuButton.height)
  ) {
    menu.open = !menu.open;
  }
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
  switch(materials[item].materialSelect ? materials[item].materialSelect.value() : materials[item].materialSelectDefault) {
    case 'ambient':
      ambientLight(color(materials[item].ambientLightPicker.color()));
      ambientMaterial(color(materials[item].colorPicker.color()));
    break;
    case 'emissive':
      emissiveMaterial(color(
        materials[item].colorPicker ? materials[item].colorPicker.color() : materials[item].colorPickerDefault
      ));
    break;
    case 'specular':
      shininess(
        materials[item].specShininess ? materials[item].specShininess.value() : materials[item].specShininessDefault
      );
      ambientLight(color(
        materials[item].specAmbientLightPicker ? materials[item].specAmbientLightPicker.color() : materials[item].specAmbientLightPickerDefault
      ));
      specularColor(color(
        materials[item].specColorPicker ? materials[item].specColorPicker.color() : materials[item].specColorPickerDefault
      ));
      pointLight(
        (materials[item].specPointLightPicker ? materials[item].specPointLightPicker.color().levels[0] : materials[item].specPointLightPickerDefault.levels[0]),
        (materials[item].specPointLightPicker ? materials[item].specPointLightPicker.color().levels[1] : materials[item].specPointLightPickerDefault.levels[1]),
        (materials[item].specPointLightPicker ? materials[item].specPointLightPicker.color().levels[2] : materials[item].specPointLightPickerDefault.levels[2]),
        mouseX - height / 2, mouseY - width / 2, 100);
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
  const controlsXOffset = 120;
  const selected = materials[item].materialSelect ? materials[item].materialSelect.value() : materials[item].materialSelectDefault;
  push();
  textAlign(CENTER);
  if (!materials[item].rendered) {
    materials[item].materialSelect = createSelect();
    materials[item].materialSelect.option('normal');
    materials[item].materialSelect.option('ambient');
    materials[item].materialSelect.option('emissive');
    materials[item].materialSelect.option('specular');
    materials[item].materialSelect.selected(selected);
    //materials[item].materialSelect.changed(() => materialSelectEvent(item));
    materials[item].colorPicker = createColorPicker(materials[item].colorPickerDefault);
    materials[item].ambientLightPicker = createColorPicker(materials[item].ambientLightPickerDefault);
    materials[item].specColorPicker = createColorPicker(materials[item].specColorPickerDefault);
    materials[item].specAmbientLightPicker = createColorPicker(materials[item].specAmbientLightPickerDefault);
    materials[item].specPointLightPicker = createColorPicker(
      materials[item].specPointLightPickerDefault.levels[0],
      materials[item].specPointLightPickerDefault.levels[1],
      materials[item].specPointLightPickerDefault.levels[2],
    );
    materials[item].specShininess = createSlider(1, 100, materials[item].specShininessDefault);
    materials[item].specShininess.style('width', '100px');
    materials[item].rendered = true;
  } else {
    materials[item].materialSelect.position(x + controlsXOffset, y + 6);
    if (selected === 'ambient' || selected === 'emissive') {
      materials[item].colorPicker.position(x + controlsXOffset, y + 31);
    } else {
      materials[item].colorPicker.position(x + controlsXOffset, -3000);
    }
    if (selected === 'ambient') {
      materials[item].ambientLightPicker.position(x + controlsXOffset, y + 64);
    } else {
      materials[item].ambientLightPicker.position(x + controlsXOffset, -3000);
    }
    if (selected === 'specular') {
      materials[item].specColorPicker.position(x + controlsXOffset, y + 31);
      materials[item].specAmbientLightPicker.position(x + controlsXOffset, y + 64);
      materials[item].specPointLightPicker.position(x + controlsXOffset, y + 97);
      materials[item].specShininess.position(x + controlsXOffset, y + 130);
    } else {
      materials[item].specColorPicker.position(x + controlsXOffset, -3000);
      materials[item].specAmbientLightPicker.position(x + controlsXOffset, -3000);
      materials[item].specPointLightPicker.position(x + controlsXOffset, -3000);
      materials[item].specShininess.position(x + controlsXOffset, y + -3000);
    }
  }
  textFont(font);
  textAlign(LEFT);
  fill(0);
  textSize(14);
  noStroke();
  text(`${item}:`, x, y);
  if (selected=== 'ambient' || selected === 'emissive') {
    text(`object:`, x, y + 30);
  }
  if (selected === 'ambient') {
    text(`ambient light:`, x, y + 62);
  }
  if (selected === 'specular') {
    text(`specular:`, x, y + 30);
    text(`ambient light:`, x, y + 62);
    text(`point light:`, x, y + 94);
    text(`shininess:`, x, y + 126);
    textAlign(RIGHT);
    text(`${materials[item].specShininess.value()}`, x + 240, y + 126);
  }
  pop();
}