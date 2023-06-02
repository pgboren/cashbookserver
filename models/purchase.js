var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const purchaseSchema = mongoose.Schema({
    number: { type: String, required: true },
    date: {type:Number, require:true},
    cashAccount: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
    qty: {type:Number, require:true},
    price: {type:Number, require:true}
});

purchaseSchema.plugin(mongoosePaginate);
var purchase = module.exports = mongoose.model('purchase', purchaseSchema);