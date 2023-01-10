  var mongoose = require('mongoose');

var stageSchema = mongoose.Schema({
    name: { type: String , required: true },
    color: { type: String , required: true },
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'board'},
    tasks : [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }]    
});

module.exports = mongoose.model('stage', stageSchema);

