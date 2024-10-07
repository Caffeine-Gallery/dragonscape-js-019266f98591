import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const player = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    speed: 5,
    jumpForce: 10,
    velocityY: 0,
    isJumping: false
};

const platforms = [
    { x: 0, y: 350, width: 800, height: 50 },
    { x: 300, y: 250, width: 200, height: 20 },
    { x: 600, y: 150, width: 200, height: 20 }
];

const gravity = 0.5;
let score = 0;

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case 'ArrowUp':
        case ' ':
            if (!player.isJumping) {
                player.velocityY = -player.jumpForce;
                player.isJumping = true;
            }
            break;
    }
});

function update() {
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Collision detection
    for (const platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height
        ) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    }

    // Keep player within canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // Update score
    score++;
    document.getElementById('scoreValue').textContent = score;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'purple';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = 'green';
    for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

async function updateHighScores() {
    await backend.addScore(score);
    const highScores = await backend.getHighScores();
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = score;
        highScoresList.appendChild(li);
    });
}

gameLoop();
setInterval(updateHighScores, 5000); // Update high scores every 5 seconds
