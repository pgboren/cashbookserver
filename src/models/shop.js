const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2');

const ShopSchema = mongoose.Schema({
  name: String,
  logo: {type: mongoose.Schema.Types.ObjectId,ref: "media"},
  address: String,
  phoneNumber: String,
  deleted: { type: Boolean, default: false}  
}, { timestamps: true });

ShopSchema.plugin(mongoosePaginate);
var shop = module.exports = mongoose.model('shop', ShopSchema);
