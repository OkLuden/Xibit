let canvas;
let context;

let click = false; 
let mouseX;
let mouseY;
let request_id;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext("2d");

    window.addEventListener("mousedown",activate,false);
    window.addEventListener("mouseup",deactivate,false);
    window.addEventListener("mousemove",track,false);

    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    if (click) {
        context.fillStyle = "black";
        context.fillRect(mouseX - 10, mouseY - 10, 5, 5);
    }
}

// activates the brush by holding down
function activate(event) {
    click = true;
}

// deactivates brush
function deactivate() {
    click = false;
}

// tracks mouse position
function track(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}
