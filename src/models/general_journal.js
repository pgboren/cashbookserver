var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// // Setup schema
const generalJournalSchema = mongoose.Schema({
    number: { type: String, required: true },
    date: {type:Number, require:true},
    transactionType: { type: String, required: true },
    items: [{type: mongoose.Schema.Types.ObjectId, ref: 'jounalEntryItem', required: false}]
});

accountSchema.plugin(mongoosePaginate);
var generalJournal = module.exports = mongoose.model('generalJournal', generalJournalSchema);