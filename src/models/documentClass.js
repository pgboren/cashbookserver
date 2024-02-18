var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

var documentClassSchema = mongoose.Schema({
  name: { type: String, required: true, index: true, unique: true },
  className: { type: String, required: true},
  fields: [{type: mongoose.Schema.Types.ObjectId, ref: 'documentField'}]
});

module.exports = mongoose.model('documentClass', documentClassSchema);