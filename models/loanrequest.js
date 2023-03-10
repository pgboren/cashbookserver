var mongoose = require('mongoose');

var loanRequestSchema = mongoose.Schema({
    number:  { type: String , required: false },
    branch: {type: mongoose.Schema.Types.ObjectId, ref: 'branch'},
    customer: {type: mongoose.Schema.Types.ObjectId, ref: 'contact'},
    date: { type: Number, required: true },
    price:  { type: Number , required: true },
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'item'},
    vehicleYear:  { type: Number },
    vehicleChassisNo:  { type: String},
    vehicleEngineNo:  { type: String},
    paymentType:  { type: String , required: false },
    institute: {type: mongoose.Schema.Types.ObjectId, ref: 'institute'},
    status:  { type: String , required: true }
});
module.exports = mongoose.model('loanrequest', loanRequestSchema);