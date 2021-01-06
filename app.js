// listeners
document.addEventListener("keydown", keyPush);

// canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// h1
const scoreBoard = document.querySelector("h1");

// game
let isRunning = true;

const tileSize = 50;
const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;
const FPS = 15;

let score = 0;

// player
let snakeSpeed = tileSize;
let snakePosX = 0;
let snakePosY = canvas.height / 2;

let velocityX = 1;
let velocityY = 0;

let tail = [];
let snakeLength = 2;

// food
let foodPosX = 0;
let foodPosY = 0;

// sound
let audioAfterFood = new Audio("./sounds/GotAnotherFood.wav");
let audioYouLost = new Audio("./sounds/Lost.ogg");
let audioYouWon = new Audio("./sounds/Win.ogg");

// game loop
function gameLoop() {
  if (isRunning) {
    drawStuff();
    moveStuff();

    // setting FPS
    setTimeout(gameLoop, 1000 / FPS);
  }
}
resetFood();
gameLoop();

// draw rectangle
function rectangle(color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// draw grid
function drawGrid() {
  for (let i = 0; i < tileCountX; i++) {
    for (let j = 0; j < tileCountY; j++) {
      rectangle("#fff", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1);
    }
  }
}

// game over
function gameOver() {
  scoreBoard.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
  isRunning = false;

  //audio
  audioYouLost.play();
}

function gameWon() {
  scoreBoard.innerHTML = `🎉 <strong> YOU WON! </strong> 🎉`;
  isRunning = false;

  // audio
  audioYouWon.play();
}

// randomize food position
function resetFood() {
  // nowhere to go
  if (snakeLength == tileCountX * tileCountY) {
    gameWon();
  }

  //audio
  if (score != 0) {
    audioAfterFood.play();
  }

  foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
  foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

  // won´t spawn food on our head
  if (snakePosX === foodPosX && snakePosY === foodPosY) {
    resetFood();
  }

  // won´t´spawn food on our body
  if (
    tail.some(
      (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
    )
  ) {
    resetFood();
  }
}

// movement
function moveStuff() {
  // basic movement on x-axis
  snakePosX += snakeSpeed * velocityX;
  snakePosY += snakeSpeed * velocityY;

  // collisions with wall
  if (snakePosX > canvas.width - tileSize) {
    snakePosX = 0;
  }
  if (snakePosX < 0) {
    snakePosX = canvas.width;
  }
  if (snakePosY > canvas.height - tileSize) {
    snakePosY = 0;
  }
  if (snakePosY < 0) {
    snakePosY = canvas.height;
  }

  // collision with ourselves - snake
  tail.forEach((snakePart) => {
    if (snakePosX == snakePart.x && snakePosY == snakePart.y) {
      gameOver();
    }
  });

  // tail
  tail.push({ x: snakePosX, y: snakePosY });

  // remove the oldest elements in the array
  tail = tail.slice(-1 * snakeLength);

  // food collision
  if (snakePosX == foodPosX && snakePosY == foodPosY) {
    // add +1 to score
    scoreBoard.textContent = ++score;

    // adding +1 to snake´s length
    snakeLength++;

    // random food position
    resetFood();
  }
}

// drawing
function drawStuff() {
  // background
  rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);

  // grid
  drawGrid();

  // tail
  tail.forEach((snakePart) =>
    rectangle("grey", snakePart.x, snakePart.y, tileSize, tileSize)
  );

  // snake
  rectangle("black", snakePosX, snakePosY, tileSize, tileSize);

  // food
  rectangle("skyblue", foodPosX, foodPosY, tileSize - 1, tileSize - 1);
}

// controls
function keyPush(event) {
  switch (event.key) {
    case "ArrowUp":
      if (velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "ArrowDown":
      if (velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
    case "ArrowLeft":
      if (velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "ArrowRight":
      if (velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
    default:
      if (!isRunning) {
        location.reload();
      }
      break;
  }
}
