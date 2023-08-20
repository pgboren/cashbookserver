var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
// Setup schema
var makerSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    photo: {type: mongoose.Schema.Types.ObjectId, ref: 'media'},
    enable: {type:Boolean,  required:true, default:false }
});

makerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('maker', makerSchema);