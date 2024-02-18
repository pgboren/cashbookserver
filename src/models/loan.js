var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const loanSchema = mongoose.Schema({
    date: {type:Number, require:false},
    contractNumber:{type:String, require:false},
    invoice: {type: mongoose.Schema.Types.ObjectId, ref: 'invoice', require: true },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute', require: true },
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact', require: true },
    amount: {type:Number, require:false},
    status: {type:String, require:true},
});

loanSchema.plugin(mongoosePaginate);
var loan = module.exports = mongoose.model('loan', loanSchema);