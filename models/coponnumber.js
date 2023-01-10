var mongoose = require('mongoose');

var CoponNumberSchema = mongoose.Schema({
    entity: {type: String, required: true, unique:true},
    key: {type: String, required: true, unique:true},
    });

module.exports = mongoose.model('coponnumber', CoponNumberSchema);