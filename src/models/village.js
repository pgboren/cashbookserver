var mongoose = require('mongoose');

var VillageSchema = mongoose.Schema({
  name: { type: String, required: true},
  commune: { type: mongoose.Schema.Types.ObjectId, ref: 'commune' }
});

var Village = module.exports = mongoose.model('village', VillageSchema);
