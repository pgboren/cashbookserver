var mongoose = require('mongoose');
// // Setup schema
const accountTypeSchema = mongoose.Schema({
    name: { type: String, required: true },
    column: { type: String, required: true }
});