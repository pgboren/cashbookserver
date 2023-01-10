var mongoose = require('mongoose');
addressSchema = require('./address');

var instituteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'media'
    },
    address: addressSchema,
    enable: {type:Boolean, 
        required:true,
        default:false
    }
});
module.exports = mongoose.model('institute', instituteSchema);