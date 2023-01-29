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
    canvas.addEventListener("pointerdown", activate, false);
    canvas.addEventListener("pointerup", deactivate, false);
    window.addEventListener("pointermove", track, false);
    thick.addEventListener("click", changeThickness, false);

    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    if (click) {
        console.log(colour.value);
        context.strokeStyle = colour.value;
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

// changes brush thickness
function changeThickness() {
    context.lineWidth = 20;
    console.log("us");
}