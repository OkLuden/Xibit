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
let eraser = document.getElementById("eraser");
let fill_shape = document.getElementById("fill_shape");
let undo = document.getElementById("undo");
let post = document.getElementById("post");
let ptIcons = document.querySelectorAll('.pt_icon');
let brushIcon = document.querySelector('#brush');
const cancelBtn = document.getElementsByClassName("edit_cancel")[0];
const cancelBtn_post = document.getElementsByClassName("edit_cancel")[1];


document.addEventListener("DOMContentLoaded", init, false);

function init() {
    
    brushIcon.classList.add('selected');
    ptIcons.forEach(icon => {
        icon.addEventListener('click', () => {
        ptIcons.forEach(icon => {
            icon.classList.remove('selected');
        });

        icon.classList.add('selected');
        });
    });

    cancelBtn.addEventListener("click", () => {
        click = false;
    });

    cancelBtn_post.addEventListener("click", () => {
        click = false;
    });

    document.getElementById("form_image").addEventListener("submit", saveImage);
    document.getElementById("form_post").addEventListener("submit", postImage);

    canvas = document.querySelector("canvas");
    canvas.height = height;
    canvas.width = width;
    context = canvas.getContext("2d");

    Coloris({
        themeMode: "dark",
        format: 'hex',
        defaultColor: '#000000',
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
    eraser.addEventListener("click", function(){ changeBrush("eraser"); }, false);
    square.addEventListener("click", function(){ changeBrush("square"); }, false);
    circle.addEventListener("click", function(){ changeBrush("circle"); }, false);

    clear.addEventListener("click", clearCanvas, false);
    undo.addEventListener("click", erasePreviousStroke, false);
    //post.addEventListener("click", postImage, false)

    draw();
}

// draws
function draw() {
    request_id = window.requestAnimationFrame(draw);
    thick_label.innerHTML = "Current Size: " + (thick.value).toString();

    if (document.getElementById("disp_saveimage").checked == true || document.getElementById("post").checked == true) {
        return
    } else {
        if (click) {
            context.fillStyle = colour.value;
            context.strokeStyle = colour.value;
            context.lineWidth = 3;
            context.lineCap = "round";
            context.lineJoin="round";
            // creates single coloured square
            if (brush == "square") {
                context.rect(mouseX - thick.value , mouseY - thick.value, thick.value * 2, thick.value * 2);
                if (fill_shape.checked) {
                    context.eraser();
                } 
                context.stroke();
                click = false;
            // creates single coloured circle
            } else if (brush == "circle") {
                context.arc(mouseX, mouseY, thick.value, 0, 360);
                if (fill_shape.checked) {
                    context.eraser();
                } 
                context.stroke(); 
                click = false;
            // normal brush stroke    
            } else if (brush == "eraser"){
                context.fillStyle = "#FFFFFF";
                context.strokeStyle = "#FFFFFF";
                context.lineWidth = thick.value;
                context.lineTo(mouseX, mouseY); 
                context.stroke();
            } else {
                context.lineWidth = thick.value;
                context.lineTo(mouseX, mouseY); 
                current_stroke[1].push([mouseX, mouseY]);
                context.stroke();
            }
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
function saveImage(event) {
    click = false;
    event.preventDefault();
    var filename = document.getElementById("file_name").value || "xibit_artwork";
    var canvas = document.querySelector("canvas");
    var image = canvas.toDataURL("image/png");
    var link = document.createElement('a');
    link.download = filename + ".png";
    link.href = image
    link.click();
    document.getElementById("disp_saveimage").checked = false;
}

// tracks colour pick changes and adds to swatches
function colourChange() {
    colour_stack.shift();
    colour_stack.push(colour.value);
    Coloris({
        themeMode: "dark",
        format: 'hex',
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

function postImage(event) {
    click = false;
    event.preventDefault();
    document.getElementById("post").checked = false;
    var tags = document.getElementById("tags").value || "Art";
    image = canvas.toDataURL("image/png");
    image = image.replaceAll("/", "@") // replaces '/' with '@' to allow use in url
    image = JSON.stringify(image);
    tags = JSON.stringify(tags);
    fetch('post/' + image + "/" + tags).then(
        response => {
            window.location = response.url
        }
    )
}