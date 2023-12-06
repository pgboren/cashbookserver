var mongoose = require('mongoose');

var ProvinceSchema = mongoose.Schema({
  name: { type: String, required: true, index: true, unique: true },
  code: { type: String, required: true},
  url: { type: String, required: true}
});

var Province = module.exports = mongoose.model('province', ProvinceSchema);