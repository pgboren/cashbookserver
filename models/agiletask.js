var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name: { type: String , required: true },
    description: { type: String , required: true },
    stage: {type: mongoose.Schema.Types.ObjectId, ref: 'agilestage', required: true},
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'agileboard', required: true},
    order: { type:Number, require:true},
}, { timestamps: true });

module.exports = mongoose.model('agiletask', taskSchema);

