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
            window.location = response.url
        }
    )
}