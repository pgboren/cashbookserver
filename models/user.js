const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar:{type: mongoose.Schema.Types.ObjectId,ref: "media"},
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
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

var user = module.exports = mongoose.model('User', UserSchema);
