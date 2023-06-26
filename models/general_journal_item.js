var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const jounalEntryItemSchema = mongoose.Schema({
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'account', required: false},
    description: { type: String, required: false },
    debit: {type:Number, require: false},
    credit: {type:Number, require: false}
});

accountSchema.plugin(mongoosePaginate);
var jounalEntryItem = module.exports = mongoose.model('jounalEntryItem', jounalEntryItemSchema);