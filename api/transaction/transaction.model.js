const mongoose = require('mongoose');
const Account = require('../account/account.model.js');

const TransactionSchema = new mongoose.Schema({
  accountId: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
  name: {type: String, required: true},
  amount: {type: Number, required: true},
  date_created: {type: Date},
  date_modififed: {type: Date}
});


module.exports = mongoose.model('Transaction', TransactionSchema);
