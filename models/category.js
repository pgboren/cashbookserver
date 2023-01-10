var mongoose = require('mongoose');
// Setup schema
var categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    enable: {type:Boolean, 
        required:true,
        default:false
    },
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'category'}
});
module.exports = mongoose.model('category', categorySchema);