var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose);
mongoose.set('useFindAndModify', false);

// Setup schema
var customerSchema = mongoose.Schema({
    
}, { timestamps: true });

customerSchema.plugin(AutoIncrement, { id: 'customer_code_seq', inc_field: 'number',  start_seq:1,  });
customerSchema.plugin(mongoosePaginate);
var Customer = module.exports = mongoose.model('customer', customerSchema);