var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const accountTypeSchema = mongoose.Schema({
    name: { type: String, required: true },
    debitEffect: { type: String, required: true },
    creditEffect: { type: String, required: true },
});

accountTypeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('accounttype', accountTypeSchema);