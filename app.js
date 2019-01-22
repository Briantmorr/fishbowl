//app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const room = require('./routes');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', room);
app.get('/', function(req, res) {
    res.sendFile('index.html');
})


let port = 3000;

app.listen(port, () => {
    console.log('Server is running on port', port);
});
