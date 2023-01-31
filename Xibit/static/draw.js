let canvas;
let context;
let request_id;

let click = false; 
let mouseX;
let mouseY;
let bounds;

colour = document.querySelector("#colour")
thick = document.getElementById("thick");
brush = document.getElementById("brush");

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    canvas.height = 600;
    canvas.width = 600;
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
        // creates single coloured square
        if (brush.value == "square") {
            context.fillStyle = colour.value;
            context.fillRect(mouseX - (thick.value * 2), mouseY - (thick.value * 2), thick.value * 4, thick.value * 4);
            click = false;
        // normal brush stroke    
        } else {
            context.strokeStyle = colour.value;
            context.lineWidth = thick.value;
            context.lineTo(mouseX, mouseY);
            context.stroke();
        }
    }
}

// activates the brush by holding down
function activate() {
    click = true;
    if (brush.value != "fill"){
        context.beginPath();
    }
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
    if (mouseX <= 0 || mouseY <= 0 || mouseX >= 600 || mouseY >= 600) {
        click = false;
    }
}