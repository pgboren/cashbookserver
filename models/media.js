var mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    name: { type: String, require: true },
    size: { type: Number, require: true },
    mimetype: { type: String, require: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date},
    path: { type: String, require: true }
  });

module.exports = mongoose.model('media', mediaSchema);
