const mongoose = require('mongoose');
const User = require('../users/users.model');
const Transaction = require('../transaction/transaction.model');

const AccountSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  incomeWeekly: {type: Number, default: 1000},
  incomeYearly: {type: Number, default: 1000},
  transactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}]
});


module.exports = mongoose.model('Account', AccountSchema);
