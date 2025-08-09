let labels = [
  'Step 1: Define Your Theme',
  'Step 2: Research and Gather Inspiration',
  'Step 3: Outline Content and Structure',
  'Step 4: Collect Visual and Written Content',
  'Step 5: Choose a Layout and Design Tool',
  'Step 6: Create a Mockup',
  'Step 7: Finalize the Layout and Content',
  'Step 8: Proofread and Edit',
  'Step 9: Print or Digitize Your Zine',
  'Step 10: Distribute Your Zine'
];

let labels2 = [...labels];
let rectangles = [];
let draggingRect = null;
let offsetX, offsetY;

let buttonX = 100, buttonY = 460, buttonW = 200, buttonH = 50;

let myFont;
let colors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#eecbff', '#dbdcff'];
let lastClickTime = 0;
let doubleClickThreshold = 300;

let bgImg, typewriterImg;
let mainTheme = [];
let words = [];
let inputBox, inputBox2;
let sendButton, sendButton2;

function preload() {
  myFont = loadFont('Website/typewcond_bold.otf');
  bgImg = loadImage('Website/background.png');
  typewriterImg = loadImage('Website/typewriter.png');
}

function setup() {
  createCanvas(1700, 3250);
  
  let indText = createP("What is your essay about?");
  indText.position(480, 260); // Position above the input box
  indText.style('font-family', 'Courier Prime');
  indText.style('font-size', '16px');
  indText.style('color', 'black'); // Change text color if needed
  indText.style('margin', '0'); // Remove default paragraph margin
  
  let indText2 = createP("How many words?:");
  indText2.position(1080, 260); // Position above the input box
  indText2.style('font-family', 'Courier Prime');
  indText2.style('font-size', '16px');
  indText2.style('color', 'black'); // Change text color if needed
  indText2.style('white-space', 'nowrap');
  indText2.style('margin', '0'); // Remove default paragraph margin

  inputBox = createInput();
  inputBox.position(450, 300);
  inputBox.size(450, 100);
  inputBox.style('height', '100px');
  inputBox.style('font-size', '16px');
  inputBox.style('border-radius', '12px');
  inputBox.style('background-color', 'rgba(212, 185, 94)');
  inputBox.input(updatePrompt);
  inputBox.style('font-family', 'Courier Prime');

  sendButton = createButton('Send');
  sendButton.position(inputBox.x + inputBox.width - 80, inputBox.y + 35);
  sendButton.style('font-family', 'Courier Prime');
  sendButton.style('font-size', '18px');
  sendButton.style('background-color', 'black');
  sendButton.style('color', 'white');
  sendButton.style('padding', '8px 16px');
  sendButton.style('border-radius', '8px');
  sendButton.mousePressed(logPrompt);
  
  


  inputBox2 = createInput();
  inputBox2.position(inputBox.x + 600, inputBox.y);
  inputBox2.size(220, 100);
  inputBox2.style('height', '100px');
  inputBox2.style('border-radius', '12px');
  inputBox2.style('background-color', 'rgba(212, 185, 94)');
  inputBox2.style('font-size', '16px');
  inputBox2.input(updateWords);
  inputBox2.style('font-family', 'Courier Prime');

  sendButton2 = createButton('Send');
  sendButton2.position(inputBox2.x + inputBox2.width - 80, inputBox2.y + 35);
  sendButton2.mousePressed(logWords);
  sendButton2.style('font-family', 'Courier Prime');
  sendButton2.style('font-size', '18px');
  sendButton2.style('background-color', 'black');
  sendButton2.style('color', 'white');
  sendButton2.style('padding', '8px 16px');
  sendButton2.style('border-radius', '8px');

  for (let i = 0; i < labels.length; i++) {
    rectangles.push(new DraggableRect(50, 350 + i * 80 + 200, 250, 70, labels[i], labels2[i], i));
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
      let newRect = new DraggableRect(50, 350 + rectangles.length * 80 + 200, 250, 70, newLabel.trim(), newLabel.trim(), labels.length);
      rectangles.push(newRect);
      labels.push(newLabel.trim());
      labels2.push(newLabel.trim());
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
    this.input1.style('font-family', 'Courier Prime');
    this.input1.style('background-color', 'rgb(245, 237, 214)');
    this.input1.style('border-radius', '10px');
    this.input1.input(() => {
      this.label = this.input1.value();
      labels[this.index] = this.label;
    });

    this.input2 = createInput(this.label2);
    this.input2.position(this.x + 400, this.y);
    this.input2.size(500, this.h + 100);
    this.input2.style('font-family', 'Courier Prime');
    this.input2.style('background-color', 'rgb(245, 237, 214)');
    this.input2.style('border-radius', '10px');
    this.input2.input(() => {
      this.label2 = this.input2.value();
      labels2[this.index] = this.label2;
    });
  }

  update() {
    if (draggingRect === this) {
      this.y = mouseY - offsetY;
    }
    this.input1.position(this.x, this.y);
    this.input2.position(this.x + 400, this.y);
  }

  show() {
    this.input1.show();
    this.input2.show();
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
