var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// // Setup schema
const accountSchema = mongoose.Schema({
    number: { type: String, required: true },
    name: { type: String, required: true },
    balance: {type:Number, require:true},
    description: { type: String },
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'accountType'}
});

accountSchema.plugin(mongoosePaginate);
var account = module.exports = mongoose.model('account', accountSchema);