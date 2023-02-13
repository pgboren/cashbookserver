const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.role = require("./role");
db.agileboard = require("./agileboard");
db.agilestage = require("./agilestage");
db.task = require("./agiletask");

db.ROLES = ["user", "admin", "moderator", "manager", "co", "saler"];

module.exports = db;