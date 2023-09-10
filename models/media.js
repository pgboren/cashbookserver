var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const mediaSchema = new mongoose.Schema({
    name: { type: String, require: true },
    size: { type: Number, require: true },
    mimetype: { type: String, require: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date},
    path: { type: String, require: true }
  });

mediaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('media', mediaSchema);
