var mongoose = require('mongoose');

var CounterSchema = mongoose.Schema({
    entity: {type: String, required: true, unique:true},
    key: {type: String, required: true, unique:true},
    seq: { type: Number, default: 0 },
    });

module.exports = mongoose.model('counter', CounterSchema);