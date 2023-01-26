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

    // mouse, touch and pen compatibility
    window.addEventListener("pointerdown", activate, false);
    window.addEventListener("pointerup", deactivate, false);
    window.addEventListener("pointermove", track, false);

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
    mouseX = event.clientX - 7;
    mouseY = event.clientY - 7;
}