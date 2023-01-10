var mongoose = require('mongoose');
// // Setup schema
var addressTypeSchema = mongoose.Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('addresstype', addressTypeSchema);

