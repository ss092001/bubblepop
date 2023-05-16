let bubbles = [];
let backgroundImage;
let bgMusic;
let bubblePopSound;
let redBubblePopSound;
let numBubblesToAdd = 0.1;
let score = 0;
let startTime;
let elapsedTime;

let buttonX, buttonY, buttonWidth, buttonHeight;

function preload() {
  backgroundImage = loadImage('ocean.jpeg');
  bgMusic = new Audio('little-mermaid-under-the-sea-instrumental.mp3');
      bgMusic.volume = .4;
  bubblePopSound = new Audio('popping.m4a');
    bubblePopSound.volume = .9;
  redBubblePopSound = new Audio('wrong.m4a');
}

function setup() {
  createCanvas(400, 400);
  bgMusic.play();
  bgMusic.loop = true;
  textSize(20);
  textAlign(RIGHT, BOTTOM);
  startTime = millis();

  buttonWidth = 120;
  buttonHeight = 40;
  buttonX = width / 2 - buttonWidth / 2;
  buttonY = height / 2 + 50;
}

const maxBubbles = 50;
const redBubbleProbability = 0.1; // Probability of a red bubble

function draw() {
  background(backgroundImage);

  // Check if the timer has exceeded 30 seconds
  elapsedTime = millis() - startTime;
  if (elapsedTime >= 30000) {
    // Timer has reached 30 seconds, stop the animation
    displayFinalScore();
    return; // Exit the draw loop
  }

  // Calculate remaining time
  let remainingTime = 30 - floor(elapsedTime / 1000);

  // Display remaining time in the bottom-left corner
  textSize(16);
  textAlign(LEFT, BOTTOM);
  fill(255);
  text('Time: ' + remainingTime, 10, height - 10);

  let numBubblesOnScreen = bubbles.length;
  let numBubblesToAdd = maxBubbles - numBubblesOnScreen;

  // Add new bubbles
  for (let i = 0; i < numBubblesToAdd; i++) {
    let radius = random(6, 20);
    let x = random(width);
    let y = height;
    let isRedBubble = random() < redBubbleProbability;
    let bubble = new Bubble(x, y, radius, isRedBubble);
    bubbles.push(bubble);
  }

  // Display and update all bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].display();
    bubbles[i].update();

    // Check if bubble reached the top of the canvas
    if (bubbles[i].reachedTop()) {
      bubbles.splice(i, 1); // Remove the bubble from the array
    }
  }

  // Display the score
  fill(255);
  stroke(0);
  strokeWeight(2);
  textFont('Arial');
  textSize(20);
  textAlign(RIGHT, BOTTOM);
  text(`Score: ${score}`, width - 10, height - 10);

  // Display the title
  fill(255);
  stroke(0);
  strokeWeight(2);
  textFont('Comic Sans MS');
  textSize(24);
  textAlign(CENTER, TOP);
  text('POP AS MANY AS YOU CAN!', width / 2, 10);
}

function displayFinalScore() {
  // Calculate the final score based on the number of popped bubbles
  let finalScore = score;

  // Display the final score
 
background(backgroundImage);
textSize(24);
textAlign(CENTER);
fill(255);
text('Final Score: ' + finalScore, width / 2, height / 2);

// Display the "Play Again" button
fill(255);
stroke(0);
strokeWeight(2);
rect(buttonX, buttonY, buttonWidth, buttonHeight);
textSize(20);
textAlign(CENTER, CENTER);
fill(0);
text('Play Again', width / 2, height / 2 + 70);

// Check if the mouse is over the button
if (
mouseX > buttonX &&
mouseX < buttonX + buttonWidth &&
mouseY > buttonY &&
mouseY < buttonY + buttonHeight
) {
fill(200);
rect(buttonX, buttonY, buttonWidth, buttonHeight);
fill(0);
text('Play Again', width / 2, height / 2 + 70);
}
}

function mousePressed() {
// Check if the mouse is over the "Play Again" button when clicked
if (
elapsedTime >= 30000 &&
mouseX > buttonX &&
mouseX < buttonX + buttonWidth &&
mouseY > buttonY &&
mouseY < buttonY + buttonHeight
) {
resetGame();
} else {
// Pop the bubbles
for (let i = bubbles.length - 1; i >= 0; i--) {
let bubble = bubbles[i];
if (bubble.clicked()) {
if (bubble.isRedBubble) {
score--; // Subtract a point for clicking a red bubble
redBubblePopSound.play(); // Play red bubble pop sound
} else {
score++;
bubblePopSound.play(); // Play regular bubble pop sound
}
bubbles.splice(i, 1);
break;
}
}
}
}

function resetGame() {
score = 0;
bubbles = [];
startTime = millis();
loop();
}

class Bubble {
constructor(x, y, radius, isRedBubble) {
this.x = x;
this.y = y;
this.radius = radius;
this.color = isRedBubble
? color(255, 0, 0, 200) // Red bubble color
: color(random(0, 100), random(100, 200), random(200, 255), 200); // Regular bubble color
this.speed = random(0.5, 1.5);
this.angle = random(TWO_PI);
this.amplitude = random(1, 2);
this.frequency = random(0.02, 0.08);
this.isRedBubble = isRedBubble;
}

display() {
noStroke();
fill(this.color);
ellipse(this.x, this.y, this.radius * 2);
  
  let shineRadius = this.radius * 0.3;
let shineColor = color(255, 255, 255, 110);
let shineX = this.x - this.radius * 0.3;
let shineY = this.y - this.radius * 0.3;
fill(shineColor);
ellipse(shineX, shineY, shineRadius * 2);
}

update() {
this.x += sin(this.angle) * this.amplitude;
this.y -= this.speed;
this.angle += this.frequency;
}

reachedTop() {
return this.y < -this.radius;
}

clicked() {
let d = dist(mouseX, mouseY, this.x, this.y);
return d < this.radius;

}
}