var mongoose = require('mongoose');
// // Setup schema
const addressSchema = mongoose.Schema({
    houseNo: { type: String, required: false },
    floor: { type: String, required: false },
    roomNumber: { type: String, required: false },
    postalCode: { type: String, required: false },
    street: { type: String, required: false },
    village: { type: String, required: false },
    commune: { type: String, required: false },
    district: { type: String, required: false },
    province: { type: String, required: false }
});

// var address = module.exports = mongoose.model('address', addressSchema);