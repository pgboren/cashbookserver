var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var instituteSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true },
    address: { type: String, required: true },
    enable: {type:Boolean, required:true, default:false }
});

instituteSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('institute', instituteSchema);