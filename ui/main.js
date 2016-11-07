//counter code
var button = document.getElementById('counter');
var counter = 0;

button.onclick = function() {
    
    //make a req to the counter endpoint
    
    //capture the response and store it in a var
    
    //render the var in the correct span
    counter = counter + 1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString();
};