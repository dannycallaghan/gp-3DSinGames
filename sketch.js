function setup () {
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);
}

function draw () {
    background(125);
    drawBoxes();

    const xLoc = cos(frameCount / 4) * (height * 1.4);
    const zLoc = sin(frameCount / 4) * (height * 1.4);
    
    camera(xLoc, -600, zLoc, 0, 0, 0, 0, 1, 0);
}

function drawBoxes () {
    normalMaterial();
    stroke(0);
    strokeWeight(2);
    for (let i = -400; i < 400; i = i + 50) {
        push();
        translate(i, 0, 0);
        box(50);
        for (let j = -400; j < 400; j = j + 50) {
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
