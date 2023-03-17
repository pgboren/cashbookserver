var mongoose = require('mongoose');
// Setup schema
var itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    nameKh: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'color', 
        require: true
    },
    power: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    description: {
        type: String
    },
    price: {
        type:Number,
        require:true
    },
    installmentPaymentPrice: {
        type:Number,
        require:true
    },
    cost: {
        type:Number,
        require:true
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'media'
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'branch'},
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category', 
        require: false},
    enable: {type:Boolean, 
        required:true,
        default:false
    }
});

var Vehicle = module.exports = mongoose.model('item', itemSchema);

