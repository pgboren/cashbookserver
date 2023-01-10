var mongoose = require('mongoose');

// Receipt schema
var receiptSchema = mongoose.Schema({
    number:  { type: Number, required: false },
    date: { type: Number, required: true },
    payee: {type: mongoose.Schema.Types.ObjectId, ref: 'contact'},
    amount:  { type: Number , required: true },
    type: { type: String, required: true },
    description:  { type: Number , required: false },
    deal: {type: mongoose.Schema.Types.ObjectId, ref: 'deal'}
});

receiptSchema.post('save', function(doc) {
    Order.findById(doc.deal).exec(
        function(err, deal){
        }
    );
  });

receiptSchema.pre('validate', function(next) {
    var doc = this;
    Counter.findOneAndUpdate({ entity: 'Receipt' }, {$inc: { seq: 1} },
        function (err, counter) {
            if (err){
                next(err);
            }
            else {
                if (counter != null) {
                    doc.number = counter.seq;
                }
                else {
                    doc.number = 1;
                    var counter = new Counter();
                    counter.seq = 2;
                    counter.entity = 'Receipt';
                    counter.save();
                }                
                next();
            }
        }
    );
  });

module.exports = mongoose.model('receipt', receiptSchema);

