var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    price: {type:Number, require:true},
    cost: {type:Number, require:true},
    description: { type: String },
    isInventory: {type:Boolean, required:true, default:true },
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    enable: {type:Boolean, required:true, default:false},
    specifications : [{type: mongoose.Schema.Types.ObjectId, ref: 'itemspecification'}]
});

itemSchema.plugin(mongoosePaginate);
var item = module.exports = mongoose.model('item', itemSchema);