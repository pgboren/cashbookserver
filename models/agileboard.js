var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
    name: { type: String , required: true },
    color: { type: String , required: true, default: "#ffffff" },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute'},
    branch: {type: mongoose.Schema.Types.ObjectId, ref: 'branch'},
    stages : [{ type: mongoose.Schema.Types.ObjectId, ref: 'stage' }]    
});

module.exports = mongoose.model('board', boardSchema);

