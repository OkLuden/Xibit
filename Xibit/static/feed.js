let posts = document.getElementsByClassName("post");
let post;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    console.log(posts)
    for (let i = 0; i < posts.length; i++) {
        post = posts[i].innerHTML;
        post = post.replaceAll(/\'/g, "\"");
        post = JSON.parse(post).image;
        post = post.replaceAll("@", "/");

        const newImg = document.createElement('img');
        newImg.src = post;
        document.body.appendChild(newImg);

    }
}
