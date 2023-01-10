var mongoose = require('mongoose');

var branchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    enable: {type:Boolean, 
        required:true,
        default:false
    }
});
module.exports = mongoose.model('branch', branchSchema);