var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
    name: { type: String , required: true, unique: true },
    color: { type: String , required: true, default: "#ffffff" },
    order: { type:Number, require:true},
});

module.exports = mongoose.model('agileboard', boardSchema);