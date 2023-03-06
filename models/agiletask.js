var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var taskSchema = mongoose.Schema({
    number:  { type: Number},
    name: { type: String , required: true },
    paymentOption: { type: String , required: true },
    date: { type: Number , required: true },
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item', require: true},
    description: { type: String , required: false },
    stage: {type: mongoose.Schema.Types.ObjectId, ref: 'agilestage', required: true},
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'agileboard', required: true},
    docs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'media'
    }]
}, { timestamps: true });
taskSchema.plugin(AutoIncrement, {inc_field: 'number'});
module.exports = mongoose.model('agiletask', taskSchema);