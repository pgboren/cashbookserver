const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.documentClass = require("./documentClass");
db.documentField = require("./documentField");

db.user = require("./user");
db.role = require("./role");
db.accounttype = require("./accounttype");
db.account = require("./account");

db.category = require("./category");
db.maker = require("./maker");
db.type = require("./type");
db.condition = require("./condition");
db.color = require("./color");
db.model = require("./model");

db.vehicle = require("./vehicle");

db.contact = require("./contact");  
db.item = require("./item");
db.invoice = require("./invoice");
db.counter = require("./counter");
db.loan = require("./loan");
db.media = require("./media");
db.institute = require("./institute");


db.ROLES = ["user", "admin", "moderator", "manager", "co", "saler"];

module.exports = db;
