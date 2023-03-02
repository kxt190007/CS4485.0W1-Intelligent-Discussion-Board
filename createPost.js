function submitPost(){
    const postTitle = document.getElementById("posttitle");
    const postContent = document.getElementById("postcontent");
    const postTag = document.getElementById("tag");
    connect();
}
function connect(){
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            document.write("Success");
        }
    };
    xhttp.open("POST", "./post.php", true);
    xhttp.send();
}
