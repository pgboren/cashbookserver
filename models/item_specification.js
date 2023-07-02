var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Setup schema
var itemSpecificationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
    showOnInvoice: {type:Boolean, 
        required:true, 
        default:false},
    order: {
        type: Number,
        required: true
    }
});

itemSpecificationSchema.plugin(AutoIncrement, { id: 'item_spec_seq', inc_field: 'order',  start_seq:0, reference_fields: ['item'] });
itemSpecificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('itemspecification', itemSpecificationSchema);