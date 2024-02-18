var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.set('useFindAndModify', false);

// Setup schema
var instituteSchema = mongoose.Schema({
  code: { type: String, required: true, index: true, unique: true },
  name: { type: String, required: true, index: true, unique: true },
  latinname: { type: String, required: false, index: true, unique: true },
  phoneNumber: { type: String, required: false },
  address: { type: String, required: false },
  logo: {type: mongoose.Schema.Types.ObjectId, ref: 'media'},
}, { timestamps: true });

instituteSchema.plugin(mongoosePaginate);
var Institute = module.exports = mongoose.model('institute', instituteSchema);