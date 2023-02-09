let canvas;
let context;
let request_id;

let click = false; 
let brush = "regular";
let mouseX;
let mouseY;
let bounds;
let scaleX;
let scaleY;
let image;
let height = 600;
let width = 1200;
let current_stroke = [];
let stroke_list = [];
let colour_stack = ['#264653', '#2a9d8f', '#e9c46a', '#e76f51', '#d62828'];

let colour = document.getElementById("colour");
let thick = document.getElementById("thick");
let thick_label = document.getElementsByClassName("textsmall")[0];
let regular = document.getElementById("brush");
let square = document.getElementById("square");
let circle = document.getElementById("circle");
let clear = document.getElementById("clear");
let save = document.getElementById("save");
let fill = document.getElementById("fill");
let undo = document.getElementById("undo");

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.height = height;
    canvas.width = width;
    context = canvas.getContext("2d");

    Coloris({
        themeMode: "dark",
        format: 'rgb',
        swatches: [
        '#264653',
        '#2a9d8f',
        '#e9c46a',
        '#e76f51',
        '#d62828'
        ]
    });

    // create white background for png image
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // mouse, touch and pen compatibility
    window.addEventListener("pointerdown", activate, false);
    canvas.addEventListener("pointerup", deactivate, false);
    window.addEventListener("pointermove", track, false);

    colour.addEventListener("change", colourChange, false);

    regular.addEventListener("click", function(){ changeBrush("regular"); }, false);
    fill.addEventListener("click", function(){ changeBrush("fill"); }, false);
    square.addEventListener("click", function(){ changeBrush("square"); }, false);
    circle.addEventListener("click", function(){ changeBrush("circle"); }, false);

    clear.addEventListener("click", clearCanvas, false);
    save.addEventListener("click", saveImage, false);
    undo.addEventListener("click", erasePreviousStroke, false);


    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    thick_label.innerHTML = "Current Size: " + (thick.value).toString();
    if (click) {
        context.fillStyle = colour.value;
        context.strokeStyle = colour.value;
        context.lineWidth = 3;
        // creates single coloured square
        if (brush == "square") {
            context.rect(mouseX - thick.value , mouseY - thick.value, thick.value * 2, thick.value * 2);
            if (fill.checked) {
                context.fill();
            } 
            context.stroke();
            click = false;
        // creates single coloured circle
        } else if (brush == "circle") {
            context.arc(mouseX, mouseY, thick.value, 0, 360);
            if (fill.checked) {
                context.fill();
            } 
            context.stroke(); 
            click = false;
        // normal brush stroke    
        } else if (brush == "fill"){
            click = false;
            imageData = context.getImageData(0, 0, width, height);
            getPixel(imageData, mouseX, mouseY);
        } else {
            context.lineWidth = thick.value;
            context.lineTo(mouseX, mouseY); 
            current_stroke[1].push([mouseX, mouseY]);
            context.stroke();
        }
    }
}

// activates the brush by holding down
function activate() {
    click = true;
    current_stroke = [thick.value, [[mouseX, mouseY]]];
    context.beginPath();  
}

// deactivates brush
function deactivate() {
    if (current_stroke.length == 0) {
        // pass
    } else {
        stroke_list.push(current_stroke);
        current_stroke = [];
    }
    click = false;
}

// tracks mouse position
function track(event) {
    bounds = canvas.getBoundingClientRect();
    mouseX = event.clientX - bounds.left;
    mouseY = event.clientY - bounds.top;
    if ((mouseX <= -30 || mouseY <= -30 || mouseX >= width+30 || mouseY >= height+30) && click == true) {
        deactivate();
    }
}

// changes brush type
function changeBrush(brush_type) {
    brush = brush_type;
}

// clears canvas
function clearCanvas() {
    context.fillStyle = "white";
    stroke_list = []; // reset all stored strokes
    context.fillRect(0, 0, width, height);
}

// saves canvas as image
function saveImage() {
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=image;
}

// tracks colour pick changes and adds to swatches
function colourChange() {
    colour_stack.shift();
    colour_stack.push(colour.value);
    Coloris({
        themeMode: "dark",
        format: 'rgb',
        swatches: [
        colour_stack[4],
        colour_stack[3],
        colour_stack[2],
        colour_stack[1],
        colour_stack[0]
        ]
    });
}

// erases previous stroke
function erasePreviousStroke() {
    click = false;
    if (stroke_list.length == 0) {
        // pass
    } else {
        current_stroke = stroke_list.pop();
        let current_stroke_list = current_stroke[1];
        context.lineWidth = current_stroke[0];
        context.strokeStyle = "white";
        context.moveTo(current_stroke_list[0][0], current_stroke_list[0][1]);
        for (let i = 1; i < current_stroke_list.length; i++) {
            context.lineTo(current_stroke_list[i][0], current_stroke_list[i][1]); 
            context.stroke();
        }
    }
}

function getPixel(imageData, x, y) {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
      return [-1, -1, -1, -1];  // impossible color
    } else {
      const offset = (y * imageData.width + x) * 4;
      console.log(imageData.data.slice(offset, offset + 4));
    }
}