let post = document.getElementById("post").innerText;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    console.log(post);
    post = post.replaceAll(/\'/g, "\"");
    post = JSON.parse(post).image;
    console.log(post);
    post = post.replaceAll("@", "/");
    console.log(post);

    const newImg = document.createElement('img');
    newImg.src = post;
    document.body.appendChild(newImg);

    //regular.addEventListener("click", function(){ changeBrush("regular"); }, false);
    //fill.addEventListener("click", function(){ changeBrush("fill"); }, false);

}

