var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);
mongoose.set('useFindAndModify', false);

// Setup schema
var contactSchema = mongoose.Schema({
  type: { type:String },
  number: { type: Number },
  name: { type: String, required: true, index: true, unique: true },
  latinname: { type: String, required: false, index: true, unique: true },
  gender: { type: String, required: false },
  nickname: { type: String, required: false },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: false },
  facebook: { type: String, required: false },
  telegram: { type: String, required: false }
}, { timestamps: true });

contactSchema.plugin(AutoIncrement, { id: 'contact_code_seq', inc_field: 'number',  start_seq:1000,  });
contactSchema.plugin(mongoosePaginate);
var Contact = module.exports = mongoose.model('contact', contactSchema);