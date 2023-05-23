var mongoose = require('mongoose');
addressSchema = require('../models/address');
const mongoosePaginate = require('mongoose-paginate-v2');

// // Setup schema
var contactSchema = mongoose.Schema({
    name: { type: String, required: true, index:true, unique: true },
    latinname: { type: String, required: false, index:true, unique: true },
    gender: { type: String, required: false },
    nickname: { type: String, required: false },
    phoneNumber1: { type: String, required: true },
    phoneNumber2: { type: String, required: false },
    phoneNumber3: { type: String, required: false },
    facebook: { type: String, required: false },
    telegram: { type: String, required: false },
    photo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'media', 
        require: false
    },
    address: addressSchema,
}, { timestamps: true });

contactSchema.plugin(mongoosePaginate);
var Contact = module.exports = mongoose.model('contact', contactSchema);