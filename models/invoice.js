var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const invoiceSchema = mongoose.Schema({
    number: { prefix: { type: String }, count: { type: Number}},    
    date: {type:Number, require:false},
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact', require: true },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute', require: false },
    vehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'vehicle', require:false},
    paymentoption: { type: String, required: false },
    qty: {type:Number, require:true},
    price: {type:Number, require:true},
    status: {type:Number, require: true}
});

invoiceSchema.plugin(AutoIncrement, { id: 'invoice_code_seq', inc_field: 'number.count',  start_seq:1000 });
invoiceSchema.plugin(mongoosePaginate);

invoiceSchema.pre('save', function(next) {
    this.number.prefix = 'INV'; 
    next();
});

var invoice = module.exports = mongoose.model('invoice', invoiceSchema);


// depositAmount: {type:Number, require:false},
// loanAmount: {type:Number, require:false},
// commission: {type:Number, require:false},
// awardAmount: {type:Number, require:false},
// otherExpenseAmount: {type:Number, require:false},
// finalPrice: {type:Number, require:false},
//Payment Options: LOAN, FULL_PAYMENT
//Status: NEW, PAID
