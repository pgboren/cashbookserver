var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// Setup schema
var categorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    enable: {type:Boolean,  required:true, default:false }
});

categorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('category', categorySchema);