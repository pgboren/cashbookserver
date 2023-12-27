const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = mongoose.Schema({
  
  username: String,
  email: String,
  password: String,
  deletable: {type: Boolean, default: true},
  avatar: {type: mongoose.Schema.Types.ObjectId,ref: "media"},
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role"
    }
  ],
  deleted: { type: Boolean, default: false}  
}, { timestamps: true });

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});


UserSchema.plugin(mongoosePaginate);
var User = module.exports = mongoose.model('user', UserSchema);
