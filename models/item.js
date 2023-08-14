var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = mongoose.Schema({
    type: { type: String, required: true },
    barcode: { type: String, required: true, unique:true },
    name: { type: String, required: true },
    photo: {type: mongoose.Schema.Types.ObjectId, ref: 'media'},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    description: { type: String },
    price: {type:Number, require:true},
    cost: {type:Number, require:true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},    
    qty: {type:Number, require:true, default:0 },
    vehiclemake: { type: String, required: false},
    vehicleChassisNo: { type: String, required: false},
    vehicleengineNo: { type: String, required: false},
    vehiclecolor: { type: String, required: false},
    vehiclehorsepower: {type: Number,min: 0},
    vehicleyear: {type:Number, require:true},
    enable: {type:Boolean, required:true, default:true}
});

itemSchema.plugin(mongoosePaginate);
var item = module.exports = mongoose.model('item', itemSchema);