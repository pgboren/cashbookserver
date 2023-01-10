var mongoose = require('mongoose');

var colorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    enable: {type:Boolean, 
        required:true,
        default:false
    }
});
module.exports = mongoose.model('color', colorSchema);