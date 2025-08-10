let labels = [
  'Step 1: Define Your Theme',
  'Step 2: Research and Gather Inspiration',
  'Step 3: Outline Content and Structure',
];

let labels2 = Array(labels.length).fill(""); 
let rectangles = [];
let draggingRect = null;
let offsetX, offsetY;

let essayOutput, generateEssayBtn;
let buttonX = 100, buttonY = 460, buttonW = 200, buttonH = 50;

let colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#eecbff', '#dbdcff'];
let lastClickTime = 0;
let doubleClickThreshold = 300;

let bgImg, typewriterImg, taskantImg, taskantGif;
let mainTheme = [];
let words = [];
let inputBox, inputBox2;
let sendButton, sendButton2;
let myFont;

let welcomeAudio;
let showGif = false;

function preload() {
  myFont = loadFont('Website/typewcond_bold.otf');
  bgImg = loadImage('Website/background.png');
  typewriterImg = loadImage('Website/typewriter.png');
  taskantImg = loadImage('Website/taskant.png');
  taskantGif = loadImage('Website/taskant.gif');
  welcomeAudio = loadSound('Website/welcome.mp3');
}

function setup() {
  createCanvas(1700, 3250);

  let indText = createP("What is your essay about?");
  indText.position(480, 260);
  styleText(indText);

  let indText2 = createP("How many words?:");
  indText2.position(1080, 260);
  styleText(indText2);

  inputBox = createInput();
  inputBox.position(450, 300);
  inputBox.size(450, 100);
  styleInput(inputBox);
  inputBox.input(updatePrompt);

  sendButton = createButton('Send');
  sendButton.position(inputBox.x + inputBox.width - 80, inputBox.y + 35);
  styleButton(sendButton, 'black', 'white');
  sendButton.mousePressed(logPrompt);

  inputBox2 = createInput();
  inputBox2.position(inputBox.x + 600, inputBox.y);
  inputBox2.size(220, 100);
  styleInput(inputBox2);
  inputBox2.input(updateWords);

  sendButton2 = createButton('Send');
  sendButton2.position(inputBox2.x + inputBox2.width - 80, inputBox2.y + 35);
  styleButton(sendButton2, 'black', 'white');
  sendButton2.mousePressed(logWords);

  generateEssayBtn = createButton("Generate Essay");
  generateEssayBtn.position(1200, 550);
  styleButton(generateEssayBtn, '#006600', 'white');
  generateEssayBtn.style('width', '200px');  
  generateEssayBtn.style('height', '50px');
  generateEssayBtn.mousePressed(generateEssay);

  essayOutput = createElement('textarea');
  essayOutput.position(1000, 650);
  essayOutput.size(600, 1000);
  essayOutput.style('font-family', 'Courier Prime');
  essayOutput.style('font-size', '16px');
  essayOutput.style('background-color', 'rgb(245, 237, 214)');
  essayOutput.style('border-radius', '10px');
  essayOutput.style('padding', '25px');
  essayOutput.attribute('readonly', '');

  for (let i = 0; i < labels.length; i++) {
    rectangles.push(new DraggableRect(50, 350 + i * 200 + 200, 250, 70, labels[i], labels2[i], i));
  }
}

function draw() {
  background(bgImg);
  textFont("Courier Prime");

  fill(0);
  textSize(120);
  textAlign(CENTER, TOP);
  text("ESSAY WRITER", width / 2, 60);
  textSize(24);
  image(typewriterImg, 200, 40, 250, 180);

  // Static image
  image(taskantImg, 1335, 40, 315, 300);

  // GIF while audio plays
  if (showGif) {
    image(taskantGif, 1400, 62, 175, 255);
  }

  fill(157, 174, 17);
  rect(buttonX, buttonY, buttonW, buttonH, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text('Add Item', buttonX + buttonW / 2, buttonY + buttonH / 2);

  for (let rect of rectangles) {
    rect.update();
    rect.show();
  }

  reorderRectangles();
}

function mousePressed() {
  // Start audio on first click
  if (!welcomeAudio.isPlaying() && getAudioContext().state !== 'running') {
    userStartAudio();
    showGif = true;
    welcomeAudio.play();
    welcomeAudio.onended(() => {
      showGif = false;
    });
  }

  let clickedOnRect = false;
  let currentTime = millis();

  for (let rect of rectangles) {
    if (rect.isMouseOver()) {
      if (currentTime - lastClickTime < doubleClickThreshold) {
        let newLabel = prompt("Edit the label:", rect.label);
        if (newLabel !== null && newLabel.trim() !== "") {
          rect.label = newLabel.trim();
          labels[rect.index] = rect.label;
        }
      } else {
        draggingRect = rect;
        offsetX = mouseX - rect.x;
        offsetY = mouseY - rect.y;
      }
      clickedOnRect = true;
      lastClickTime = currentTime;
      break;
    }
  }

  if (!clickedOnRect && isButtonClicked()) {
    let newLabel = prompt("Enter the label for the new item:");
    if (newLabel && newLabel.trim() !== "") {
      let newRect = new DraggableRect(50, 350 + rectangles.length * 200 + 200, 250, 70, newLabel.trim(), "", labels.length);
      rectangles.push(newRect);
      labels.push(newLabel.trim());
      labels2.push("");
    } else {
      alert("Invalid label. Item was not added.");
    }
  }
}

function mouseReleased() {
  draggingRect = null;
  reorderRectangles();
}

function isButtonClicked() {
  return mouseX > buttonX && mouseX < buttonX + buttonW &&
         mouseY > buttonY && mouseY < buttonY + buttonH;
}

function reorderRectangles() {
  if (draggingRect) return;
  rectangles.sort((a, b) => a.y - b.y);
  for (let i = 0; i < rectangles.length; i++) {
    rectangles[i].y = 350 + i * 200 + 200;
    labels[i] = rectangles[i].label;
    labels2[i] = rectangles[i].label2;
    rectangles[i].index = i;
  }
}

class DraggableRect {
  constructor(x, y, w, h, label, label2, index) {
    this.x = x;
    this.y = y;
    this.w = w * 1.25;
    this.h = 70;
    this.label = label;
    this.label2 = label2;
    this.color = random(colors);
    this.index = index;

    this.input1 = createInput(this.label);
    this.input1.position(this.x, this.y);
    this.input1.size(300, this.h);
    styleInput(this.input1);
    this.input1.input(() => {
      this.label = this.input1.value();
      labels[this.index] = this.label;
    });

    this.input2 = createInput("");
    this.input2.position(this.x + 400, this.y);
    this.input2.size(450, this.h + 100);
    styleInput(this.input2);
    this.input2.input(() => {
      this.label2 = this.input2.value();
      labels2[this.index] = this.label2;
    });

    this.deleteBtn = createButton("Delete");
    styleButton(this.deleteBtn, '#cc0000', 'white', 14);
    this.deleteBtn.mousePressed(() => {
      rectangles.splice(this.index, 1);
      labels.splice(this.index, 1);
      labels2.splice(this.index, 1);
      rectangles.forEach((r, i) => r.index = i);
      this.input1.remove();
      this.input2.remove();
      this.deleteBtn.remove();
      this.generateBtn.remove();
    });

    this.generateBtn = createButton("Generate");
    styleButton(this.generateBtn, '#0066cc', 'white', 14);
    this.generateBtn.mousePressed(() => {
      labels2[this.index] = this.input1.value(); 
      this.input2.value(labels2[this.index]);
      this.label2 = labels2[this.index];
    });
  }

  update() {
    if (draggingRect === this) {
      this.y = mouseY - offsetY;
    }
    this.input1.position(this.x, this.y);
    this.input2.position(this.x + 400, this.y);
    this.deleteBtn.position(this.x + 150, this.y + 80);
    this.generateBtn.position(this.x + 250, this.y + 80);
  }

  show() {
    this.input1.show();
    this.input2.show();
    this.deleteBtn.show();
    this.generateBtn.show();
  }

  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.w &&
           mouseY > this.y && mouseY < this.y + this.h;
  }
}

function updatePrompt() {
  mainTheme[0] = this.value();
}

function updateWords() {
  words[0] = this.value();
}

function logPrompt() {
  console.log(mainTheme);
}

function logWords() {
  console.log(words);
}

function generateEssay() {
  let paragraphs = labels2
    .map(text => text.trim())
    .filter(text => text.length > 0)
    .join("\n\n");
  essayOutput.value(paragraphs);
}

// --- Helpers ---
function styleText(el) {
  el.style('font-family', 'Courier Prime');
  el.style('font-size', '16px');
  el.style('color', 'black');
  el.style('margin', '0');
  el.style('white-space', 'nowrap');
}

function styleInput(el) {
  el.style('height', '100px');
  el.style('font-size', '16px');
  el.style('border-radius', '12px');
  el.style('background-color', 'rgba(212, 185, 94)');
  el.style('font-family', 'Courier Prime');
}

function styleButton(btn, bg, fg, size=18) {
  btn.style('font-family', 'Courier Prime');
  btn.style('font-size', `${size}px`);
  btn.style('background-color', bg);
  btn.style('color', fg);
  btn.style('padding', '8px 16px');
  btn.style('border-radius', '8px');
}
