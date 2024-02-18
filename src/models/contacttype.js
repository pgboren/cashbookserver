var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// // Setup schema
var contacttypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    codePrefix: {
        type: String,
        required: true,
        unique: true
    }
};

contacttypeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('contacttype', contacttypeSchema);