const mongoose = require('mongoose');
import User from '../users/users.model';

const AccountSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.String, ref: 'User'},
  incomeWeekly: {type: Number, default: 1000},
  incomeYearly: {type: Number, default: 1000},
});


module.exports = mongoose.model('Account', AccountSchema);
