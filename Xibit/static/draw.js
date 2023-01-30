let canvas;
let context;
let request_id;

let click = false; 
let mouseX;
let mouseY;

colour = document.querySelector("#colour")
thick = document.getElementById("thick");

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.height = 800;
    canvas.width = 1200;
    context = canvas.getContext("2d");

    // mouse, touch and pen compatibility
    window.addEventListener("pointerdown", activate, false);
    window.addEventListener("pointerup", deactivate, false);
    canvas.addEventListener("pointermove", track, false);

    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    if (click) {
        context.strokeStyle = colour.value;
        context.lineWidth = thick.value;
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
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
}

// changes brush thickness
function changeThickness() {
    context.lineWidth = 20;
    console.log("us");
}