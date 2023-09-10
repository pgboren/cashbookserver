require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const util = require('util');
const demo = require('./data/demo_data');

connnection_string = util.format('mongodb://boren:boren@127.0.0.1:27017/cashbook');
mongoose.connect(connnection_string, { useNewUrlParser: true, useUnifiedTopology: true});
var database = mongoose.connection;
if(!database) {
	console.log("Error connecting db");
}
else {
	database.dropCollection('contacts', function(err, result) {});
	database.dropCollection('institutes', function(err, result) {});
	database.dropCollection('vehicles', function(err, result) {});
	demo();
	console.log("Db connected successfully");
}

process.exit();