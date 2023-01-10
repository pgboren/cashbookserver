  var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name: { type: String , required: true },
    color: { type: String , required: true },
    description: { type: String , required: true },
    createdDate: { type: Number, required: true },
    dueDate: { type: Number, required: false },
    priority: { type: String , required: true },
    assignee : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    deal : {type: mongoose.Schema.Types.ObjectId, ref: 'deal'},
    boking : {type: mongoose.Schema.Types.ObjectId, ref: 'receipt'},
    invoice : {type: mongoose.Schema.Types.ObjectId, ref: 'invoice'},
    stage: {type: mongoose.Schema.Types.ObjectId, ref: 'stage'},
});

//priority ["LOW", "MEDIUMN", "HIGHT"]

module.exports = mongoose.model('task', taskSchema);

