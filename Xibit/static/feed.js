let posts = document.getElementsByClassName("post");
let users = document.getElementsByClassName("user");
let likes = document.getElementsByClassName("likes");
let displays = document.getElementsByClassName("display");
let pfps = document.getElementsByClassName("pfp");
let id = document.getElementsByClassName("id");
let datetime = document.getElementsByClassName("date");
let user_likes = document.getElementsByClassName("user_likes");

let post;
let likeButton; 
let likeID;
let postID;
let like;
let datetimes;
let image;
let ids;
let id_list = [];
let user_likes_list = [];

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    for (let i = 0; i < user_likes.length; i++) {
        user_likes_list[i] = user_likes[i].innerHTML;
    }
    for (let i = 0; i < posts.length; i++) {
        id_list[i] = id[i].innerHTML;

        post = posts[i].innerHTML;
        post = post.replaceAll("@", "/");
        
        const newImg = document.createElement('img');
        newImg.setAttribute("id", "post_image" + i.toString());
        const newPfp = document.createElement('img');
        newPfp.setAttribute("id", "post_pfp");
        const newDiv = document.createElement('div');
        newDiv.setAttribute("class", "post_div");
        const topDiv = document.createElement('div');
        topDiv.setAttribute("class", "top_div");
        const proDiv = document.createElement('div');
        proDiv.setAttribute("class", "pro_div");
        const sepDiv = document.createElement('div');
        sepDiv.setAttribute("class", "sep_div");
        const username = document.createElement('p');
        username.setAttribute("id", "username_post");
        const display = document.createElement('p');
        display.setAttribute("id", "display_post");
        const date = document.createElement('p');
        date.setAttribute("id", "date_of_post");
        like = document.createElement('button');
        like.setAttribute("id", "likes" + i.toString());

        newDiv.setAttribute("id", "post" + i.toString());
        topDiv.setAttribute("id", "top" + i.toString());
        proDiv.setAttribute("id", "pro" + i.toString());
        newImg.src = post;
        newPfp.src = "static/images/profilepics/" + pfps[i].innerHTML;
        username.innerHTML = "@" + users[i].innerHTML;
        display.innerHTML = displays[i].innerHTML;
        date.innerHTML = "Posted: " + datetime[i].innerHTML;
        like.innerHTML = "Likes: " + likes[i].innerHTML;

        if (user_likes_list.includes(id_list[i])) {
            like.setAttribute("value", true);
            like.setAttribute("name", true);
        } else {
            like.setAttribute("value", false);
            like.setAttribute("name", false);
        }


        document.getElementById("main").appendChild(topDiv);
        document.getElementById("top" + i.toString()).appendChild(newDiv);
        document.getElementById("post" + i.toString()).appendChild(proDiv);
        document.getElementById('pro' + i.toString()).appendChild(newPfp);
        document.getElementById('pro' + i.toString()).appendChild(display);
        document.getElementById('pro' + i.toString()).appendChild(username);
        document.getElementById('post' + i.toString()).appendChild(newImg);
        document.getElementById('post' + i.toString()).appendChild(like);
        document.getElementById('post' + i.toString()).appendChild(date);
        document.getElementById('top' + i.toString()).appendChild(sepDiv);

        likeButton = document.getElementById("likes" + i.toString());
        image = document.getElementById("post_image" + i.toString());
        likeButton.addEventListener("click", function(){ likePost(i.toString()); }, false);
        image.addEventListener("click", function(){ viewPost(i.toString()); }, false);
        
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
    
    ids = document.querySelectorAll('.id');
    ids.forEach(option => {
        option.remove();
    });

    datetimes = document.querySelectorAll('.date');
    datetimes.forEach(option => {
        option.remove();
    });

    user_likes = document.querySelectorAll('.user_likes');
    user_likes.forEach(option => {
        option.remove();
    });
}

function likePost(i) {
    likeID = id_list[i];
    like = document.getElementById('likes' + i.toString());
    const request = new XMLHttpRequest();
    if (like.value == "false") {
        request.open('POST', 'like/' + likeID.toString());
        request.send();
        if (like.name == "true") {
            like.innerHTML = "Likes: " + (Number(likes[i].innerHTML)).toString();
        } else {
            like.innerHTML = "Likes: " + (Number(likes[i].innerHTML) + 1).toString();
        }
        like.value = true;
    } else {
        request.open('POST', 'delike/' + likeID.toString());
        request.send();
        if (like.name == "false") {
            like.innerHTML = "Likes: " + (Number(likes[i].innerHTML)).toString();
        } else {
            like.innerHTML = "Likes: " + (Number(likes[i].innerHTML) - 1).toString();
        }
        like.value = false;
    }
}

function viewPost(i) {
    postID = id_list[i];
    console.log(postID);
    fetch('viewPost/' + postID.toString()).then(
        response => {
            window.location = response.url
        }
    )
}

function reload() {
    location.reload();
}