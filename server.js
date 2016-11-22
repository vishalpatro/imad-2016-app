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

var articles = {
    'article-one': {
        title: 'Article One | Vishal Patro',
        heading: 'Article One',
        date: 'Nov 7, 2016',
        content: `
            <p>
                This is the content for my first article. This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>
            <p>
                This is the content for my first article. This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>
            <p>
                This is the content for my first article. This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>`
    },
    'article-two': {
        title: 'Article Two | Vishal Patro',
        heading: 'Article Two',
        date: 'Nov 8, 2016',
        content: `
            <p>
                This is the content for my second article. This is the content for my second article. This is the content for my second article.This is the content for my second article. This is the content for my second article. This is the content for my second article.
            </p>
            <p>
                This is the content for my second article. This is the content for my second article. This is the content for my second article.This is the content for my second article. This is the content for my second article. This is the content for my second article.
            </p>
            <p>
                This is the content for my second article. This is the content for my second article. This is the content for my second article.This is the content for my second article. This is the content for my second article. This is the content for my second article.
            </p>`
    },
    'article-three': {
        title: 'Article Three | Vishal Patro',
        heading: 'Article Three',
        date: 'Nov 10, 2016',
        content: `
            <p>
                This is the content for my third article. This is the content for my third article.This is the content for my third article.This is the content for my third article.This is the content for my third article.This is the content for my third article.
            </p>
            <p>
                This is the content for my third article. This is the content for my third article.This is the content for my third article.This is the content for my third article.This is the content for my third article.This is the content for my third article.
            </p>
            <p>
                This is the content for my third article. This is the content for my third article.This is the content for my third article.This is the content for my third article.This is the content for my third article.This is the content for my third article.
            </p>`
    }
};
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
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date}
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
            res.send(JSON.stringify(result));
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



app.get('/:articleName', function(req, res) {
    //articleName = article-one
    //articles[articleName] = {} content for article one
    var articleName = req.params.articleName;
    //this abv statement is use to extract the article name  and use into the index of the articles object whch is used to create template
    res.send(createTemplate(articles[articleName])); 
});

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
