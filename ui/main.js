/*
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
    /* counter = counter + 1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString(); */
// };


/*var submit = document.getElementById('submit_btn');
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

*/



function loadLoginForm () {
    var loginHtml = `
        <h3>Login/Register to unlock awesome features</h3>
        <input type="text" id="username" placeholder="username" />
        <input type="password" id="password" />
        <br/><br/>
        <input type="submit" id="login_btn" value="Login" />
        <input type="submit" id="register_btn" value="Register" />
        `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
    
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (username.trim() === '' || password.trim() === '') {
        alert("Username/Password field can't be left empty");
        return;
    }
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
         if (username.trim() === '' || password.trim() === '') {
        alert("Username/Password field can't be left empty");
        return;
    }
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <h3> Hi <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `;
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}


function loadArticleForm() {
	//added form tag and required attributes
    var articleHtml = `
        <h2>Write an Article</h2>
	<form id="article_form">
        <input type="text" id="heading" placeholder="Heading" required/><br/>
        <input type="text" id="title" placeholder="Title" required/><br/>
        <textarea rows="4" cols="50" id="content" placeholder="Content" required></textarea><br/>
        <input type="submit" id="save_btn" value="Create Article" />
 	</form>
        `;
        document.getElementById('article_area').innerHTML = articleHtml;
        var store = document.getElementById('save_btn');
	//handling onsubmit event of form
 	var article_form=document.getElementById('article_form');
         article_form.onsubmit = function (e) {
 	e.preventDefault();//prevent default form submission
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                  alert('Article created successfully');
		  //location.reload(true);
		  //reset the form
		  article_form.reset();
		  //now, load the articles dynamically
		  loadArticles();
              }else if(request.status === 403){ //for alerting users to register/login to create article
                alert('You must Register/Login to create new Article');
	      } 
              else {
		  //use this alert message
                  alert('Article could not be created or Article already exist!');
              }
		  //use this once here
		  store.value = 'Create Article';
          }
        };
	var heading = document.getElementById('heading').value;
	var title = document.getElementById('title').value;
	var content = document.getElementById('content').value;
        request.open('POST', '/create-article', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({heading:heading, title:title , content:content}));  
        store.value = 'Creating...';
    };
}

// The first thing to do is to check if the user is logged in!

loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!

loadArticles();

loadArticleForm();
