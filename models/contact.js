var mongoose = require('mongoose');
addressSchema = require('../models/address');

// // Setup schema
var contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    latinname: { type: String, required: false },
    gender: { type: String, required: false },
    nickname: {
        type: String,
        required: false
    },
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
    address: addressSchema
}, { timestamps: true });

var Contact = module.exports = mongoose.model('contact', contactSchema);

