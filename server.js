var express = require('express');
var app = express();
const Redis = require('ioredis');
require('dotenv').config();

// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));

// routes for app
app.get('/', function (req, res) {
    res.render('pad');
});

app.get('/(:id)', function (req, res) {
    res.render('pad');
});

// get sharejs dependencies
var sharejs = require('share');

// set up redis server
const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

// check connection
redisClient.on("connect", () => {
    console.log("Redis Connected")
})

// options for sharejs
var options = {
    db: { type: 'redis', client: redisClient }
};

// attach the express server to sharejs
sharejs.server.attach(app, options);

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
app.listen(port);
