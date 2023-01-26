let canvas;
let context;
let request_id;

let click = false; 
let mouseX;
let mouseY;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext("2d");

    window.addEventListener("mousedown", activate, false);
    window.addEventListener("mouseup", deactivate, false);
    window.addEventListener("mousemove", track, false);

    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    if (click) {
        context.lineTo(mouseX, mouseY);
        context.stroke();
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
    mouseX = event.clientX - 10;
    mouseY = event.clientY - 10;
}
