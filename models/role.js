const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var roleSchema = mongoose.Schema({
  name: String
});

roleSchema.plugin(mongoosePaginate);
var Role = module.exports = mongoose.model('role', roleSchema);