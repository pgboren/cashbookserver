const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const UserAccessTokenSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  token: String, 
  type: String,
  active: {type:Boolean,  required:true, default:false }
}, { timestamps: true });

module.exports = mongoose.model('UserAccessToken', UserAccessTokenSchema);
