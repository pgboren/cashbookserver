  var mongoose = require('mongoose');

var stageSchema = mongoose.Schema({
    name: { type: String , required: true },
    color: { type: String , required: true },
    icon: { type: String , required: false },
    order: { type:Number, require:true},
    
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'agileboard'}
});

module.exports = mongoose.model('agilestage', stageSchema);

