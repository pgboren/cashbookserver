var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = mongoose.Schema({
    number: { type: String, required: true },
    name: { type: String, required: true },
    price: {type:Number, require:true},
    description: { type: String },
    isInventory: {type:Boolean, required:true, default:true },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'}
});

itemSchema.plugin(mongoosePaginate);
var item = module.exports = mongoose.model('item', itemSchema);