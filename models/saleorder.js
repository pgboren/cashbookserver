const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var saleOrderSchema = mongoose.Schema({
    number:  { type: Number},
    branch: {type: mongoose.Schema.Types.ObjectId, ref: 'branch'},
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact'},
    date: { type: Number, required: true },
    bookingAmount:  { type: Number },
    paymentOption:  { type: String , required: false },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute'},
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
    vehicleCondition:{ type: String , required: true },
    quantity: { type:Number, require:true},
    price: { type:Number, require:true},
    status:{ type:String, require:true},
}, { timestamps: true });

saleOrderSchema.plugin(AutoIncrement, {inc_field: 'number'});
module.exports = mongoose.model('saleorder', saleOrderSchema);