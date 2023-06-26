const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.role = require("./role");
db.accounttype = require("./accounttype");
db.account = require("./account");
db.category = require("./category");
db.contact = require("./contact");
db.item = require("./item");
db.institute = require("./institute");
db.invoice = require("./invoice");
db.color = require("./color");
db.counter = require("./counter");
db.loan = require("./loan");
db.itemspecification = require("./item_specification");

db.ROLES = ["user", "admin", "moderator", "manager", "co", "saler"];

module.exports = db;