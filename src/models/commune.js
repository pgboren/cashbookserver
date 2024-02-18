var mongoose = require('mongoose');

var CommuneSchema = mongoose.Schema({
  name: { type: String, required: true},
  code: { type: String, required: true},
  url: { type: String},
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'district' }
});

var Commune = module.exports = mongoose.model('commune', CommuneSchema);