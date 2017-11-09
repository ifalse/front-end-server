var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// for (var m in models) {
//   mongoose.model(m, new Schema(models[m]));
// }

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

mongoose.model('User', UserSchema);

module.exports = {
  getModel: function(type) {
    return _getModel(type);
  }
};
var _getModel = function(type) {
  return mongoose.model(type);
};