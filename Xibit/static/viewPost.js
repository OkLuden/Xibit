let posts = document.getElementsByClassName("post");
let users = document.getElementsByClassName("user");
let likes = document.getElementsByClassName("likes");
let displays = document.getElementsByClassName("display");
let pfps = document.getElementsByClassName("pfp");
let id = document.getElementsByClassName("id");

let post;
let likeButton; 
let likeID;
let postID;
let like;
let datetimes;
let image;
let ids;
let value;


document.addEventListener("DOMContentLoaded", init, false);

function init() {

    for (let i = 0; i < posts.length; i++) {

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
        const tag = document.createElement('p')
        tag.setAttribute("id", "tags")
        like = document.createElement('button');
        like.setAttribute("id", "likes" + i.toString());

        newDiv.setAttribute("id", "post" + i.toString());
        topDiv.setAttribute("id", "top" + i.toString());
        proDiv.setAttribute("id", "pro" + i.toString());
        newImg.src = post;
        newPfp.src = "../static/images/profilepics/" + pfps[i].innerHTML;
        username.innerHTML = "@" + users[i].innerHTML;
        display.innerHTML = displays[i].innerHTML;

        document.getElementById("main").appendChild(topDiv);
        document.getElementById("top" + i.toString()).appendChild(newDiv);
        document.getElementById("post" + i.toString()).appendChild(proDiv);
        document.getElementById('pro' + i.toString()).appendChild(newPfp);
        document.getElementById('pro' + i.toString()).appendChild(display);
        document.getElementById('pro' + i.toString()).appendChild(username);
        document.getElementById('post' + i.toString()).appendChild(newImg);
        document.getElementById('post' + i.toString()).appendChild(like);
        document.getElementById('post' + i.toString()).appendChild(tag);
        document.getElementById('post' + i.toString()).appendChild(date);
        document.getElementById('top' + i.toString()).appendChild(sepDiv);

        likeButton = document.getElementById("likes" + i.toString());
        image = document.getElementById("post_image" + i.toString()); 
        
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
        
        tags = document.querySelectorAll('.tags');
        tags.forEach(option => {
            option.remove();
        });
    }
}
