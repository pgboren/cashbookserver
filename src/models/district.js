var mongoose = require('mongoose');
var commune = require("./commune");

var DistrictSchema = mongoose.Schema({
  name: { type: String, required: true},
  code: { type: String, required: true},
  url: { type: String},
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'province' }
});

var Distict = module.exports = mongoose.model('district', DistrictSchema);

