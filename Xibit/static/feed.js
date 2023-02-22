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
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "post" + i.toString());
        newImg.src = post;
        document.body.appendChild(newDiv);
        document.getElementById('post' + i.toString()).appendChild(newImg);

    }
}
