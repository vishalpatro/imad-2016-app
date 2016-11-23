var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
  host: 'db.imad.hasura-app.io',
  user: 'vishalpatro',
  password: process.env.DB_PASSWORD,
  database: 'vishalpatro'
  //we dont wan to show password so DB_PASSWORD IS A ENV VAR and to access that we use process.env
};


var app = express();
app.use(morgan('combined'));

function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width-device-width, initial-scale-1" />
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <ul class="topnav">
                      <li><a class="active" href="/">Home</a></li>
                      <li><a href="#news">News</a></li>
                      <li><a href="/contact">Contact</a></li>
                      <li class="right"><a href="/about">About</a></li>
                    </ul>
                    <br/>
                    <br/>
                </div>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                    ${content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    //make a select req
    //return a res with results
    pool.query('select * from test', function(err, result) {
        if(err) {
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

var counter = 0;
app.get('/counter', function (req, res) {
  counter = counter + 1;
  res.send(counter.toString());
});
//we can only send a string as a response



//query parameter
//extract of inf after ?
//URL: /submit-name?name=xxxx

var names = [];
app.get('/submit-name', function (req, res) {
    //get the name from the req
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});



app.get('/articles/:articleName', function(req, res) {
    //articleName = article-one
    //articles[articleName] = {} content for article one
     pool.query("select * from article where title = $1", [req.params.articleName], function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        }else {
            if(result.rows.length === 0) {
                res.status(404).send('Article not found');
            }
            else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

/*app.get('/articles/:articleName', function(req, res) {
    //articleName = article-one
    //articles[articleName] = {} content for article one
    //var articleName = req.params.articleName;
    //this abv statement is use to extract the article name  and use into the index of the articles object whch is used to create template
    
    pool.query("select * from article where title = '" + req.params.articleName + "'", function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        }else {
            if(result.rows.length === 0) {
                res.status(404).send('Article not found');
            }
            else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});*/

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});



/*
//getting an information as a part of URL and then sending that inf back as json
var names = [];
app.get('/submit-name/:name', function (req, res) {
    //get the name from the req
   var name = req.params.name; //TODO
   
   names.push(name);//to extract name and concatenate
   //how to convert this object to string,here comes JSON
   //JSON: javascript obj notation : to convert java string objects into string
   //here using json we conv array of names into string
   res.send(JSON.stringify(names));//obj to string conv
});
*/



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
