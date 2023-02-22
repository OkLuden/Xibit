let posts = document.getElementsByClassName("post");
let post;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    for (let i = 0; i < posts.length; i++) {
        post = posts[i].innerHTML;
        post = post.replaceAll(/\'/g, "\"");
        // post on main branch comes out different for unknown reason, have to slice
        post = post.slice(2);
        post = post.slice(0, -3)
        post = post.replaceAll("@", "/");

        const newImg = document.createElement('img');
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "post" + i.toString());
        newImg.src = post;
        document.body.appendChild(newDiv);
        document.getElementById('post' + i.toString()).appendChild(newImg);
        
    }
    posts = document.querySelectorAll('.post');

    posts.forEach(option => {
        option.remove();
    });

}
