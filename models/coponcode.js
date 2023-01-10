var mongoose = require('mongoose');

var CoponCodeSchema = mongoose.Schema({
    entity: {type: String, required: true, unique:true},
    key: {type: String, required: true, unique:true},
    });

module.exports = mongoose.model('coponcode', CoponCodeSchema);