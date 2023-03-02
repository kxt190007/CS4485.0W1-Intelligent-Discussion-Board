
let titleData = ['Post1title','Post2title','Post3title','Post4title'];
let list = document.getElementById("titleList");
titleData.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item;
    list.appentChild(li);

})

