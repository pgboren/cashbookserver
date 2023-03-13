var mongoose = require('mongoose');
Contact = require('../models/contact');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongoosePaginate = require('mongoose-paginate-v2');

var taskSchema = mongoose.Schema({
    number:  { type: Number},
    name: { type: String , required: true },  
    paymentOption: { type: String , required: true },
    date: { type: Number , required: true },
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact', required: true},    
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true},    
    price: { type:Number, require:true},
    description: { type: String , required: false },
    stage: {type: mongoose.Schema.Types.ObjectId, ref: 'agilestage', required: true},
    board: {type: mongoose.Schema.Types.ObjectId, ref: 'agileboard', required: true},
    docs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'media'
    }]
}, { timestamps: true });
taskSchema.plugin(AutoIncrement, {inc_field: 'number'});
taskSchema.plugin(mongoosePaginate);

taskSchema.pre('validate', async function(next) {    
    if (this.isNew) {
        const newContact = new Contact();
        newContact.name = this.name;
        newContact.phoneNumber1 = this.phoneNumber;
        await newContact.save();
        this.customer = newContact._id;

        console.log('About to save new document...');
      } else {
        // perform some action only for nodeexisting documents
        console.log('About to update existing document...');
      }
    next();
});

module.exports = mongoose.model('agiletask', taskSchema);