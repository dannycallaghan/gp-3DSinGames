let confLocs = []; // Stores the location of each piece of confetti
let confTheta = []; // Stores the initial angle of each piece of confetti
const numOfConfetti = 200; // Number of confetti pieces
// Stores the defaults for the material settings
const materials = {
  boxes: {
    rendered: false,
    materialSelectDefault: 'specular',
    specShininessDefault: 1,
    colorPickerDefault: '#18ef50',
    ambientLightPickerDefault: '#ff4400',
    specColorPickerDefault: '#ff4400',
    specAmbientLightPickerDefault: '#999999',
    specPointLightPickerDefault: {
      levels: [255, 255, 0]
    },
    specGrayValueDefault: 70
  },
  confetti: {
    confetti: false,
    materialSelectDefault: 'specular',
    specShininessDefault: 1,
    colorPickerDefault: '#18ef50',
    ambientLightPickerDefault: '#ff4400',
    specColorPickerDefault: '#ff4400',
    specAmbientLightPickerDefault: '#999999',
    specPointLightPickerDefault: {
      levels: [255, 255, 0]
    },
    specGrayValueDefault: 70
  }
};
// Stores the defaults for the settings
const settings = {
  waveSpeed: {
    rendered: false,
    default: 1
  },
  boxHeightMax: {
    rendered: false,
    default: 300
  },
  boxHeightMin: {
    rendered: false,
    default: 100
  },
  noise: {
    rendered: false,
    default: 0
  },
  zoom: {
    rendered: false,
    default: 4
  },
  placement: {
    rendered: false,
    default: -600
  },
};
let font; // Standard font for preloading
let boldFont; // Bold font for preloading
// Canvas dimensions
const canvasWidth = 900;
const canvasHeight = 800;
// Menu button specifics so we can test for a click
const menuButton = {
  x: 274,
  y: 0,
  width: 26,
  height: canvasHeight
};
// Menu specifics so we can move it in and out of view
const menu = {
  open: false,
  openX: 0,
  closedX: -276
};

/**
 * P5 preload function
 *
 * @return void.
 */
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

  // Angle default
  angleMode(DEGREES);

  // Noise default
  noiseSeed(0);

  // Create the confetti
  initConfetti();
}

/**
 * P5 draw function
 *
 * @return void.
 */
function draw () {
  background(125);

  // Noise detail level
  noiseDetail(4);
  
  push();

  // Camera
  rotateCamera();

  // Boxes
  drawBoxes();
  
  // Confetti
  confetti();

  pop();

  // Draw menu  
  drawMenu();
  
}

/**
 * Draws the menu and calls the various sections
 *
 * @return void.
 */
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
  // Settings
  drawSettingsMenu();
}

/**
 * Draws the material section of the menu
 *
 * @return void.
 */
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
  text('MATERIALS', menuX, 0);
  // HR
  push();
  stroke(0);
  strokeWeight(1);
  line(menuX, 10, menuX + 240, 10)
  pop();
  // Boxes material selector
  drawMaterialSettings(0, 34, 'boxes');
  // Get menus y position
  const yOffset = getMenusYOffset('boxes');
  // HR
  push();
  stroke(160);
  strokeWeight(1);
  line(menuX, yOffset, menuX + 240, yOffset)
  pop();
  // Confetti material selector
  drawMaterialSettings(0, yOffset + 24, 'confetti');
  pop();
}

/**
 * Draws the settings section of the menu
 *
 * @return void.
 */
function drawSettingsMenu () {
  const menuX = menu.open ? menu.openX : menu.closedX;
  const yOffset = getMenusYOffset('boxes') + getMenusYOffset('confetti') + 30;
  push();
  noStroke();
  // Translate to top left to make things easier
  translate(-width / 2, (-height / 2) + yOffset);
  // Title
  translate(10, 20);
  textFont(boldFont);
  textAlign(LEFT);
  fill(0);
  textSize(14);
  text('SETTINGS', menuX, 0);
  // HR
  push();
  stroke(0);
  strokeWeight(1);
  line(menuX, 10, menuX + 240, 10)
  pop();
  // Call render on the various sliders
  drawAnimationSettingsSlider(0, 34, yOffset, 1, 50, 'waveSpeed', 'wave speed');
  drawAnimationSettingsSlider(0, 64, yOffset, 1, 800, 'boxHeightMin', 'min box height');
  drawAnimationSettingsSlider(0, 94, yOffset, 10, 800, 'boxHeightMax', 'max box height');
  drawAnimationSettingsSlider(0, 124, yOffset, 1, 10, 'zoom', 'camera distance');
  drawAnimationSettingsSlider(0, 154, yOffset, -2000, 2000, 'placement', 'camera pos');
  drawAnimationSettingsSlider(0, 184, yOffset, 0, 50, 'noise', 'noise');
  pop();
}

/**
 * Calculates the y position of the menus depeding on how many material options are being shown.
 *
 * @param {string} item - The key of the material menu we're calculating how many items are being shown
 * 
 * @return {number} - The y offset
 */
function getMenusYOffset (item) {
  let yOffset;
  switch (materials[item].materialSelect ? materials[item].materialSelect.value() : materials[item].materialSelectDefault) {
    case 'specular':
      yOffset = 208;
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
  return yOffset;
}

/**
 * P5 event listener - mouse clicked
 * Sets a flag to show or hide the menu
 *
 * @return void.
 */
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

/**
 * Calls P5 material functions on an item, depending on what was selected
 *
 * @param {string} item - The material function types to call
 * 
 * @return void.
 */
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
      specularMaterial(
        materials[item].specGrayValue ? materials[item].specGrayValue.value() : materials[item].specGrayValueDefault
      );
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
    const speed = settings.waveSpeed.slider ? settings.waveSpeed.slider.value() : settings.waveSpeed.default;
    const maxHeight = settings.boxHeightMax.slider ? settings.boxHeightMax.slider.value() : settings.boxHeightMax.default;
    const minHeight = settings.boxHeightMin.slider ? settings.boxHeightMin.slider.value() : settings.boxHeightMin.default;
    const noiseAmount = settings.noise.slider ? settings.noise.slider.value() : settings.noise.default;
    getMaterial('boxes');
    // Commented out as we are dynamically selecting the type of material used, with getMaterial('boxes') above
    // normalMaterial();
    stroke(0);
    strokeWeight(2);
    translate(i, 0, 0);
    box(50);
    for (let j = -400; j < 400; j = j + 50) {
      // Calculate the height of each box
      let distance = dist(0, 0, i, j) + (frameCount * speed);
      if (noiseAmount) {
        const n = noise(i * noiseAmount, j * noiseAmount);
        distance = dist(0, 0, i, j) + (frameCount * speed) * n;
      }
      const length = map(sin(distance), -1, 1, minHeight, maxHeight);
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
  const zoomRatio = settings.zoom.slider ? settings.zoom.slider.value() : settings.zoom.default;
  const placement = settings.placement.slider ? settings.placement.slider.value() : settings.placement.default;
  const zoom = zoomRatio * 0.1 + 1;

  const xLoc = cos(frameCount) * (height * zoom);
  const zLoc = sin(frameCount) * (height * zoom);
  camera(xLoc, placement, zLoc, 0, 0, 0, 0, 1, 0);
}

/**
 * Animated the confetti
 *
 * @return void.
 */
function confetti () {
  for (let i = 0, j = confLocs.length; i < j; i++) {
    const v = confLocs[i];
    confLocs[i].set(v.x, v.y + 1, v.z);
    push();
    getMaterial('confetti');
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

/**
 * Draws the material selection section for objects passed to it
 *
 * @param {number} xPos - The x position of the meny
 * @param {number} yPos - The y position of the meny
 * @param {string} item - The object we're applying the settings to
 * 
 * @return void.
 */
function drawMaterialSettings (xPos, yPos, item) {
  const controlsX = menu.open ? menu.openX : menu.closedX;
  const x = controlsX + xPos;
  const y = yPos;
  const controlsXOffset = controlsX + 120;
  const selected = materials[item].materialSelect ? materials[item].materialSelect.value() : materials[item].materialSelectDefault;
  push();
  textAlign(CENTER);
  if (!materials[item].rendered) {
    // Create the selector
    materials[item].materialSelect = createSelect();
    materials[item].materialSelect.option('normal');
    materials[item].materialSelect.option('ambient');
    materials[item].materialSelect.option('emissive');
    materials[item].materialSelect.option('specular');
    materials[item].materialSelect.selected(selected);
    // Create the colour pickers
    materials[item].colorPicker = createColorPicker(materials[item].colorPickerDefault);
    materials[item].ambientLightPicker = createColorPicker(materials[item].ambientLightPickerDefault);
    materials[item].specColorPicker = createColorPicker(materials[item].specColorPickerDefault);
    materials[item].specAmbientLightPicker = createColorPicker(materials[item].specAmbientLightPickerDefault);
    materials[item].specPointLightPicker = createColorPicker(
      materials[item].specPointLightPickerDefault.levels[0],
      materials[item].specPointLightPickerDefault.levels[1],
      materials[item].specPointLightPickerDefault.levels[2],
    );
    // Create sliders
    materials[item].specShininess = createSlider(1, 100, materials[item].specShininessDefault);
    materials[item].specShininess.style('width', '100px');
    materials[item].specGrayValue = createSlider(0, 255, materials[item].specGrayValueDefault);
    materials[item].specGrayValue.style('width', '100px');
    materials[item].rendered = true;
  } else {
    // We've created the items, now position them
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
      materials[item].specGrayValue.position(x + controlsXOffset, y + 163);
    } else {
      materials[item].specColorPicker.position(x + controlsXOffset, -3000);
      materials[item].specAmbientLightPicker.position(x + controlsXOffset, -3000);
      materials[item].specPointLightPicker.position(x + controlsXOffset, -3000);
      materials[item].specShininess.position(x + controlsXOffset, y + -3000);
      materials[item].specGrayValue.position(x + controlsXOffset, y + -3000);
    }
  }
  // Draw the labels
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
    text(`gray value:`, x, y + 158);
    textAlign(RIGHT);
    text(`${materials[item].specShininess.value()}`, x + 240, y + 126);
    text(`${materials[item].specGrayValue.value()}`, x + 240, y + 158);
  }
  pop();
}

/**
 * Draws a slider
 *
 * @param {number} xPos - The x position of the meny
 * @param {number} yPos - The y position of the meny
 * @param {number} yOffset - The y offset depending on what appears above
 * @param {number} min - The min slider value
 * @param {number} max - The max slider value
 * @param {string} item - The object we're applying the settings to
 * @param {string} label - The sliders label
 * 
 * @return void.
 */
function drawAnimationSettingsSlider (xPos, yPos, yOffset, min, max, item, label) {
  const controlsX = menu.open ? menu.openX : menu.closedX;
  const x = controlsX + xPos;
  const y = yPos;
  const controlsXOffset = controlsX + 120;
  if (!settings[item].rendered) {
    settings[item].slider = createSlider(min, max, settings[item].default);
    settings[item].slider.style('width', '100px');
    settings[item].rendered = true;
  } else {
    settings[item].slider.position(0 + controlsXOffset, y + yOffset + 4);
  }
  // Draw the label
  push();
  textFont(font);
  textAlign(LEFT);
  fill(0);
  textSize(14);
  noStroke();
  text(`${label}:`, x, y);
  textAlign(RIGHT);
  text(`${settings[item].slider.value()}`, x + 250, y);
  pop();
}
