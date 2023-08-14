var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const documentFieldSchema = mongoose.Schema({
  documentClass: {type: mongoose.Schema.Types.ObjectId, ref: 'documentClass'},
  name: { type: String, required: true },
  type: { type: String, required: true },
  multiplicity: { type: String, required: true, default: 'single' },
  format: { type: String, required: false },
  data: [{type: String}],
  targetDocumentClass: { type: String, required: false },
  require: {type:Boolean, required:true, default:true}
});

module.exports = mongoose.model('documentField', documentFieldSchema);