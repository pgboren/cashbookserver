var mongoose = require('mongoose');
// // Setup schema
const accountTypeSchema = mongoose.Schema({
    name: { type: String, required: true },
    debitEffect: { type: String, required: true },
    creditEffect: { type: String, required: true },
});

var accountType = module.exports = mongoose.model('accountType', accountTypeSchema);