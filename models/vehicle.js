var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const vehicleSchema = mongoose.Schema({
    barcode: { type: String, required: true, unique:true },
    name: { type: String, required: true },
    photo: {type: mongoose.Schema.Types.ObjectId, ref: 'media'},
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account'},
    description: { type: String, required: false },
    price: {type:Number, require:true},
    cost: {type:Number, require:true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},    
    make: { type: String, required: false},
    model: { type: String, required: false},
    type: {type:String, require:true},
    condition: {type:String, require:true},
    chassisno: { type: String, required: false},
    engineno: { type: String, required: false},
    color: { type: String, required: false},
    horsepower: {type: String},
    year: {type:Number, require:true},
    enable: {type:Boolean, required:true, default:true}
});

vehicleSchema.plugin(mongoosePaginate);
var vehicle = module.exports = mongoose.model('vehicle', vehicleSchema);