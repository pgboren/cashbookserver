const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const UserShopRoleSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop"
  }
}, { timestamps: true });

var usershop = module.exports = mongoose.model('usershop', UserShopRoleSchema);
