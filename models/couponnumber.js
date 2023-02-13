var mongoose = require('mongoose');

var CouponNumberSchema = mongoose.Schema({
    entity: {type: String, required: true},
    number: { type: Number, default: 0 },    
});

module.exports = mongoose.model('couponnumber', CouponNumberSchema);