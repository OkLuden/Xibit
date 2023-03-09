document.addEventListener("DOMContentLoaded", init, false);

function init() {

    document.getElementById("post_search").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            search();
        }
    });

}

function search() {
    value = document.getElementById("post_search").value;
    console.log(value);
    fetch('searchPost/' + value).then(
        response => {
            let url = response.url;
            if (response.url.includes("/searchPost/searchPost")) {            
                url = (response.url).replace('/searchPost', '');
            }
            console.log(url);
            window.location = url;
        }
    )
}