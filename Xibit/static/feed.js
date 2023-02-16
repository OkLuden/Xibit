let posts = document.getElementsByClassName("post");
let post;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    console.log(posts)
    for (let i = 0; i < posts.length; i++) {
        post = posts[i].innerHTML;
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
}
