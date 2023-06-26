var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var colorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    enable: {type:Boolean, 
        required:true,
        default:false
    }
});

colorSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('color', colorSchema);