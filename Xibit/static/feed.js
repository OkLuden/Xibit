let posts = document.getElementsByClassName("post");
let users = document.getElementsByClassName("user");
let post;
let user; 

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    console.log(users);
    for (let i = 0; i < posts.length; i++) {
        post = posts[i].innerHTML;
        post = post.replaceAll(/\'/g, "\"");
        // post on main branch comes out different for unknown reason, have to slice
        post = post.slice(2);
        post = post.slice(0, -3)
        post = post.replaceAll("@", "/");

        const newImg = document.createElement('img');
        const newDiv = document.createElement('div');
        const username = document.createElement('p');
        newDiv.setAttribute("id", "post" + i.toString());
        newImg.src = post;
        username.innerHTML = "Created by " + users[i].innerHTML;
        document.body.appendChild(newDiv);
        document.getElementById('post' + i.toString()).appendChild(newImg);
        document.getElementById('post' + i.toString()).appendChild(username);
        
    }
    posts = document.querySelectorAll('.post');

    posts.forEach(option => {
        option.remove();
    });

    users = document.querySelectorAll('.user');

    users.forEach(option => {
        option.remove();
    });


}
