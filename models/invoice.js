var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const invoiceSchema = mongoose.Schema({
    number: { type: String, required: true },
    date: {type:Number, require:true},
    paymentType: { type: String, required: true },
    contact: {type: mongoose.Schema.Types.ObjectId, ref: 'contact'},
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute'},
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
    machineNumber: { type: String, required: true },
    chassisNumber: { type: String, required: true },
    color: { type: String, required: true },
    year: {type:Number, require:true},
    condition: { type: String, required: true },
    qty: {type:Number, require:true},
    price: {type:Number, require:true}
});

invoiceSchema.plugin(mongoosePaginate);
var invoice = module.exports = mongoose.model('invoice', invoiceSchema);