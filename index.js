require("dotenv").config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
let mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const multer  = require('multer');
const http = require('http');
const moment= require('moment') 
require('moment-timezone') 
const cors = require('cors');
const WebSocket = require('ws');

const Media = require('./models/media');
const util = require('util');
var media = require('./controllers/media.controller');

const initialdata = require('./data/initialdata');
const mrz = require('machine-readable-zone');

const dateThailand = moment.tz(Date.now(), "Asia/Bangkok");

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const app = express();

const app_conf = config.get('App');

connnection_string = util.format('mongodb://boren:boren@127.0.0.1:27017/cashbook');
mongoose.connect(connnection_string, { useNewUrlParser: true, useUnifiedTopology: true});
var database = mongoose.connection;
if(!database) {
	console.log("Error connecting db");
}
else {
	initialdata();
	console.log("Db connected successfully");
}

app.use(cors());

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(express.static('public'));

// Set up WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    console.log('WebSocket Client connected');
    // Send a welcome message to the client
    socket.send('Welcome to the WebSocket server!');
});

module.exports = { app, server, wss };

require('./routes/crud.routes')(app);
require('./routes/view.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/role.routes')(app);
require('./routes/media.routes')(app);
require('./routes/refdata.routes')(app);
require('./routes/gazetteer.routes')(app);

// app.listen(port, function () {
//     console.log("Running RestHub on port " + port);
// });

server.listen(port, function () {
    console.log("Running RestHub on port " + port);
});
