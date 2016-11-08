//counter code
var button = document.getElementById('counter');
//var counter = 0;

button.onclick = function() {
    
    //make a req to the counter endpoint
        //create a request object
        var request = new XMLHttpRequest();
    
    //capture the response and store it in a var
        request.onreadystatechange = function(){
            if(request.readyState === XMLHttpRequest.DONE) {
                //TAKE some action
                if(request.status === 200){
                    //code to increament counter
                    var counter = request.responseText;
                    var span = document.getElementById('count');
                    span.innerHTML = counter.toString();
                }
            }
        };
        
        //make a request
        request.open('GET','http://vishalpatro.imad.hasura-app.io/counter', true);
        request.send(null);
        //so when this request is made to the url and the request state changes to request is done and the code inside outerif is executed
    //render the var in the correct span
    /*counter = counter + 1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString();*/
};


var submit = document.getElementById('submit_btn');
submit.onclick = function(){
  
  //create a request object
        var request = new XMLHttpRequest();
    
    //capture the response and store it in a var
        request.onreadystatechange = function(){
            if(request.readyState === XMLHttpRequest.DONE) {
                //TAKE some action
                if(request.status === 200){//condition means that request is successfull or not
                    //capture a list of names and render it as a list
                      //var names = ['name1','name2','name3','name4'];
                      var names = request.responseText;
                      names = JSON.parse(names);//converting string to object,in this case,an array
                      var list = '';
                      for(var i=0; i<names.length; i++){
                          list += '<li>' + names[i] + '</li>';
                      }
                      var ul = document.getElementById('namelist');
                      ul.innerHTML = list;//rendering list of names
                }
            }
        };
        
        
        //submit name or extract of name after clicking of button
        var nameInput = document.getElementById('name');
        var name = nameInput.value;//inputbox value
        //make a request
        request.open('GET','http://vishalpatro.imad.hasura-app.io/submit-name?name=' + name, true);//value of name comes from inputbox
        request.send(null);
};