var mongoose = require('mongoose');

// Receipt schema
var invoiceSchema = mongoose.Schema({
    number:  { type: Number, required: false },
    date: { type: Number, required: true },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute'},
    payee: {type: mongoose.Schema.Types.ObjectId, ref: 'contact'},
    amount:  { type: Number , required: true },
    description:  { type: Number , required: false },
    deal: {type: mongoose.Schema.Types.ObjectId, ref: 'deal'}
});

module.exports = mongoose.model('invoice', invoiceSchema);