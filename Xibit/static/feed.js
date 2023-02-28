let posts = document.getElementsByClassName("post");
let users = document.getElementsByClassName("user");
let likes = document.getElementsByClassName("likes");
let displays = document.getElementsByClassName("display");
let pfps = document.getElementsByClassName("pfp");
let post;
let likeButton; 

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    for (let i = 0; i < posts.length; i++) {
        post = posts[i].innerHTML;
        console.log(post);
        post = post.replaceAll("@", "/");
        
        const newImg = document.createElement('img');
        newImg.setAttribute("id", "post_image");
        const newPfp = document.createElement('img');
        newPfp.setAttribute("id", "post_pfp");
        const newDiv = document.createElement('div');
        newDiv.setAttribute("class", "post_div");
        const username = document.createElement('p');
        username.setAttribute("id", "username_post");
        const display = document.createElement('p');
        display.setAttribute("id", "display_post");
        const like = document.createElement('button');
        like.setAttribute("id", "likes" + i.toString());

        newDiv.setAttribute("id", "post" + i.toString());
        newImg.src = post;
        newPfp.src = "static/images/profilepics/" + pfps[i].innerHTML;
        username.innerHTML = users[i].innerHTML;
        display.innerHTML = displays[i].innerHTML;
        like.innerHTML = "Likes: " + likes[i].innerHTML;

        document.getElementById('top_post').appendChild(newDiv);
        document.getElementById('post' + i.toString()).appendChild(newPfp);
        document.getElementById('post' + i.toString()).appendChild(username);
        document.getElementById('post' + i.toString()).appendChild(display);
        document.getElementById('post' + i.toString()).appendChild(newImg);
        document.getElementById('post' + i.toString()).appendChild(like);

        likeButton = document.getElementById("likes" + i.toString());
        likeButton.addEventListener("click", likePost, false);
        
    }

    posts = document.querySelectorAll('.post');
    posts.forEach(option => {
        option.remove();
    });

    users = document.querySelectorAll('.user');
    users.forEach(option => {
        option.remove();
    });

    likes = document.querySelectorAll('.likes');
    likes.forEach(option => {
        option.remove();
    });

    displays = document.querySelectorAll('.display');
    displays.forEach(option => {
        option.remove();
    });

    pfps = document.querySelectorAll('.pfp');
    pfps.forEach(option => {
        option.remove();
    });
}

function likePost() {
    console.log("hello");
}