// Get canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Get UI elements
const gameContainer = document.getElementById('game-container');
const instructionText = document.getElementById('instruction-text');
const scoreDisplay = document.getElementById('score-display');
const resetButton = document.getElementById('reset-button');

// Game state variables
let caterpillar;
let leaves;
let nextNumber;
let score;

// --- Main Functions ---

/**
 * Initializes or resets the game state.
 */
function init() {
    // Initialize game state
    caterpillar = [{x: 100, y: 300, num: 1}];
    leaves = [];
    nextNumber = 2;
    score = 1;

    generateLeaves();

    // Update UI
    instructionText.textContent = `Find the number ${nextNumber}!`;
    scoreDisplay.textContent = `Length: ${score}`;

    // Start the game loop
    gameLoop();
}

/**
 * The main game loop, running on every frame.
 */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

/**
 * Updates the game state. (Logic)
 */
function update() {
    // Game logic will go here in a future step
}

/**
 * Renders the game objects to the canvas. (Graphics)
 */
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCaterpillar();
    drawLeaves();
}

/**
 * Draws the caterpillar on the canvas.
 */
function drawCaterpillar() {
    ctx.font = '20px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    caterpillar.forEach((segment, index) => {
        // Draw segment body
        ctx.fillStyle = index === caterpillar.length - 1 ? '#ff6347' : '#4caf50'; // Head is red
        ctx.beginPath();
        ctx.arc(segment.x, segment.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw segment number
        ctx.fillStyle = 'white';
        ctx.fillText(segment.num, segment.x, segment.y);
    });
}

/**
 * Draws the leaves on the canvas.
 */
function drawLeaves() {
    ctx.font = '24px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    leaves.forEach(leaf => {
        // Draw leaf
        ctx.fillStyle = '#6b8e23'; // Olive Drab
        ctx.beginPath();
        ctx.ellipse(leaf.x, leaf.y, 30, 20, Math.random(), 0, Math.PI * 2);
        ctx.fill();

        // Draw leaf number
        ctx.fillStyle = 'white';
        ctx.fillText(leaf.num, leaf.x, leaf.y);
    });
}

/**
 * Generates a new set of leaves, including the correct next number.
 */
function generateLeaves() {
    leaves = [];
    const correctLeafNum = nextNumber;

    // Add the correct leaf
    leaves.push({
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 200) + 50, // Keep leaves in upper area
        num: correctLeafNum
    });

    // Add a few incorrect leaves
    for (let i = 0; i < 3; i++) {
        let wrongNum;
        do {
            wrongNum = Math.floor(Math.random() * 10) + 1;
        } while (wrongNum === correctLeafNum || leaves.some(l => l.num === wrongNum));

        leaves.push({
            x: Math.random() * (canvas.width - 100) + 50,
            y: Math.random() * (canvas.height - 200) + 50,
            num: wrongNum
        });
    }

    // Shuffle leaves positions
    leaves.sort(() => Math.random() - 0.5);
}

/**
 * Handles mouse clicks on the canvas.
 * @param {MouseEvent} event
 */
function handleMouseClick(event) {
    // Get click coordinates relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let correctLeafClicked = false;
    leaves.forEach(leaf => {
        const distance = Math.sqrt((mouseX - leaf.x) ** 2 + (mouseY - leaf.y) ** 2);
        if (distance < 30) { // 30 is the radius of the leaf's click area
            if (leaf.num === nextNumber) {
                correctLeafClicked = true;
                // --- Correct Choice ---
                score++;
                nextNumber++;

                // Add new segment to caterpillar
                const lastSegment = caterpillar[caterpillar.length - 1];
                caterpillar.push({ x: lastSegment.x + 40, y: lastSegment.y, num: nextNumber - 1 });

                // Update UI
                instructionText.textContent = `Find the number ${nextNumber}!`;
                scoreDisplay.textContent = `Length: ${score}`;

                // Generate new leaves
                generateLeaves();

                // Visual Feedback
                gameContainer.classList.add('correct-answer');
                setTimeout(() => gameContainer.classList.remove('correct-answer'), 300);

            } else {
                // --- Incorrect Choice ---
                gameContainer.classList.add('incorrect-answer');
                setTimeout(() => gameContainer.classList.remove('incorrect-answer'), 500);
            }
        }
    });
}


// --- Event Listeners ---
canvas.addEventListener('click', handleMouseClick);
resetButton.addEventListener('click', init);


// --- Start Game ---
init();
