console.log('Loaded!');
var element = document.getElementById('main-text');

element.innerHTML = 'New value';

//move the image
var img = document.getElementById('vishal');
var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 10;
    img.style.marginLeft = marginLeft + 'px';//concatenating 10 with px
}
img.onclick = function(){
    var interval = setInterval(moveRight,100);
};