let canvas;
let context;
let request_id;

let click = false; 
let mouseX;
let mouseY;
let bounds;
let scaleX;
let scaleY;
let image;
let height = 600;
let width = 1200;

let colour = document.getElementById("colour");
let thick = document.getElementById("thick");
let thick_label = document.getElementsByClassName("textsmall")[0];
let brush = document.getElementById("brush");
let clear = document.getElementById("clear");
let save = document.getElementById("save");
let fill = document.getElementById("fill");

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.height = height;
    canvas.width = width;
    context = canvas.getContext("2d");

    // create white background for png image
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // mouse, touch and pen compatibility
    window.addEventListener("pointerdown", activate, false);
    canvas.addEventListener("pointerup", deactivate, false);
    window.addEventListener("pointermove", track, false);
    clear.addEventListener("click", clearCanvas, false);
    save.addEventListener("click", saveImage, false);

    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    thick_label.innerHTML = "Current Size: " + (thick.value).toString();
    if (click) {
        context.fillStyle = colour.value;
        context.strokeStyle = colour.value;
        // creates single coloured square
        if (brush.value == "square") {
            context.rect(mouseX - (thick.value * 2), mouseY - (thick.value * 2), thick.value * 4, thick.value * 4);
            if (fill.checked) {
                context.fill();
            } 
            context.stroke();
            click = false;
        // creates single coloured circle
        } else if (brush.value == "circle") {
            context.arc(mouseX, mouseY, thick.value, 0, 360);
            if (fill.checked) {
                context.fill();
            } 
            context.stroke(); 
            click = false;
        // normal brush stroke    
        } else {
            context.lineWidth = thick.value;
            context.lineTo(mouseX, mouseY); 
            context.stroke();
        }
    }
}

// activates the brush by holding down
function activate() {
    click = true;
    context.beginPath();  
}

// deactivates brush
function deactivate() {
    click = false;
}

// tracks mouse position
function track(event) {
    bounds = canvas.getBoundingClientRect();
    mouseX = event.clientX - bounds.left;
    mouseY = event.clientY - bounds.top;
    console.log(fill.checked);
    if (mouseX <= -30 || mouseY <= -30 || mouseX >= width+30 || mouseY >= height+30) {
        click = false;
    }
}

// clears canvas
function clearCanvas() {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
}

// saves canvas as image
function saveImage() {
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href=image;
}