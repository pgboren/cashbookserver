var mongoose = require('mongoose');

var offerSchema = mongoose.Schema({
    number:  { type: Number, required: false },
    date: { type: Number, required: true },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute', required: true},    
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact', required: true},    
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true},    
    price: { type:Number, require:true },
    deposit: { type:Number, require: true, default: 0},
    status:{ type:String, require:true }
});
module.exports = mongoose.model('offer', offerSchema);