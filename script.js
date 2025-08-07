// Game state variables
let caterpillar;
let leaves;
let nextNumber;
let score;
let gameOver;

// UI Elements
let instructionText;
let scoreDisplay;
let resetButton;
let canvas;

// Game settings
const segmentSize = 30;
const leafSize = 40;

// p5.js setup function - runs once when the page loads
function setup() {
    // Set up the canvas
    canvas = createCanvas(600, 400);
    canvas.parent('canvas-container');

    // Get UI elements from the DOM
    instructionText = select('#instruction-text');
    scoreDisplay = select('#score-display');
    resetButton = select('#reset-button');
    resetButton.mousePressed(resetGame);

    // Initialize the game state
    resetGame();
}

// Resets the game to its initial state
function resetGame() {
    gameOver = false;
    caterpillar = [
        { x: 100, y: 200, num: 1 },
        { x: 100 - segmentSize, y: 200, num: 2 }
    ];
    score = 2;
    nextNumber = 3;

    updateUI();
    generateLeaves();
    loop(); // Make sure the draw loop is running
}

// Main p5.js draw loop - runs continuously
function draw() {
    if (gameOver) {
        background(200);
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(0);
        text("You Win! Well Done!", width / 2, height / 2);
        noLoop(); // Stop the draw loop
        return;
    }

    background(240, 255, 240); // A very light green, like a meadow
    drawCaterpillar();
    drawLeaves();
}

// Draws the caterpillar on the canvas
function drawCaterpillar() {
    for (let i = caterpillar.length - 1; i >= 0; i--) {
        let segment = caterpillar[i];
        // Body
        fill(100, 200, 100); // Green
        stroke(50, 100, 50);
        strokeWeight(2);
        ellipse(segment.x, segment.y, segmentSize);

        // Number
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(15);
        text(segment.num, segment.x, segment.y);

        // Eyes on the head (first segment)
        if (i === 0) {
            fill(0);
            ellipse(segment.x - 5, segment.y - 5, 4, 4);
            ellipse(segment.x + 5, segment.y - 5, 4, 4);
        }
    }
}

// Draws the leaves on the canvas
function drawLeaves() {
    for (const leaf of leaves) {
        fill(50, 150, 50); // Dark green for leaves
        stroke(30, 100, 30);
        strokeWeight(2);
        ellipse(leaf.x, leaf.y, leafSize, leafSize + 10);

        // Number on the leaf
        fill(255);
        noStroke();
        textSize(18);
        text(leaf.num, leaf.x, leaf.y);
    }
}

// Generates a new set of leaves
function generateLeaves() {
    leaves = [];
    let correctLeaf = { x: 0, y: 0, num: nextNumber };
    leaves.push(correctLeaf);

    // Generate 2-3 incorrect leaves
    let numIncorrect = floor(random(2, 4));
    for (let i = 0; i < numIncorrect; i++) {
        let incorrectNum;
        do {
            incorrectNum = floor(random(1, nextNumber + 5));
        } while (incorrectNum === nextNumber || leaves.find(l => l.num === incorrectNum)); // Avoid duplicates

        leaves.push({ x: 0, y: 0, num: incorrectNum });
    }

    // Shuffle and position the leaves to avoid overlap
    leaves = shuffle(leaves);
    for (let i = 0; i < leaves.length; i++) {
        let placed = false;
        while (!placed) {
            let x = random(50, width - 50);
            let y = random(50, height - 100);
            let overlapping = false;
            for (let j = 0; j < i; j++) {
                if (dist(x, y, leaves[j].x, leaves[j].y) < leafSize * 2) {
                    overlapping = true;
                    break;
                }
            }
            if (!overlapping) {
                leaves[i].x = x;
                leaves[i].y = y;
                placed = true;
            }
        }
    }
}

// p5.js function that runs when the mouse is pressed
function mousePressed() {
    if (gameOver) return;

    for (const leaf of leaves) {
        if (dist(mouseX, mouseY, leaf.x, leaf.y) < leafSize / 2) {
            handleLeafClick(leaf);
            return; // Exit after handling one click
        }
    }
}

// Logic for when a leaf is clicked
function handleLeafClick(leaf) {
    if (leaf.num === nextNumber) {
        // CORRECT CHOICE
        score++;
        nextNumber++;

        // Add a new segment to the caterpillar
        const head = caterpillar[0];
        const newSegment = { x: head.x + segmentSize, y: head.y, num: score };
        // A bit of logic to make the caterpillar snake around
        if(newSegment.x > width - segmentSize) {
            newSegment.x = head.x;
            newSegment.y = head.y + segmentSize;
        }
        caterpillar.unshift(newSegment); // Add to the front

        if (score >= 10) { // Win condition
            gameOver = true;
        } else {
            generateLeaves();
        }
    } else {
        // INCORRECT CHOICE
        // Shake the screen a little
        canvas.elt.style.animation = 'shake 0.5s';
        setTimeout(() => {
            canvas.elt.style.animation = '';
        }, 500);
        // Maybe add a sound here in the future
    }
    updateUI();
}

// Updates the UI text
function updateUI() {
    scoreDisplay.html(`Length: ${score}`);
    if (!gameOver) {
        instructionText.html(`Find the number: ${nextNumber}`);
    } else {
        instructionText.html('You Won!');
    }
}

// Add CSS for the shake animation
function styleInject(css) {
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}

styleInject(`
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
`);
