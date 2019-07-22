const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Account = require('../account/account.model');

// /
const UserSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String, required: true},
  date_created: {type: Date},
  date_modififed: { type: Date},
  account: {type: mongoose.Schema.Types.String, ref: 'Account'}
});

const User = mongoose.model('User', UserSchema);

// UserSchema.methods.comparePasswords = function(password, callback){
// 	bcrypt.compare(password, this.password, callback);
// }


// /

UserSchema.pre('find', function(next) {
  console.log('find');
  next();
});

UserSchema.pre('save', function(next) {
  console.log('inside userscheme pre');
  let user = this;

  // if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.log(err);
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        console.log(err);
        return next(err);
      }

      user.password = hash;
      console.log(user.password);
      next();
    });
  });
});


module.exports = mongoose.model('User', UserSchema);
