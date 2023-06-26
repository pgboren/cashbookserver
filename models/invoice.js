var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invoiceSchema = mongoose.Schema({
    number: {prefix: { type: String }, count: { type: Number}},
    date: {type:Number, require:false},
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact', require: true },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute', require: false },
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item', require:false},
    machineNumber: { type: String, required: false },
    chassisNumber: { type: String, required: false },
    plateNumber: { type: String, required: false },
    color: {type: mongoose.Schema.Types.ObjectId, ref: 'color', require:false},
    year: {type:Number, require:false},
    condition: { type: String, required: false },
    paymentoption: { type: String, required: false },
    qty: {type:Number, require:false},
    price: {type:Number, require:false}
});

invoiceSchema.plugin(AutoIncrement, { id: 'invoice_code_seq', inc_field: 'number.count',  start_seq:1000 });
invoiceSchema.plugin(mongoosePaginate);
var invoice = module.exports = mongoose.model('invoice', invoiceSchema);