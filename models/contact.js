var mongoose = require('mongoose');
addressSchema = require('../models/address');

// // Setup schema
var contactSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    gender: { type: String, required: true },
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
});

var Contact = module.exports = mongoose.model('contact', contactSchema);

