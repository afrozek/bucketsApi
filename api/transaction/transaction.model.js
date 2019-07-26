const mongoose = require('mongoose');
const Account = require('../account/account.model.js');

const TransactionSchema = new mongoose.Schema({
  accountId: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
  name: {type: String, required: true, default: "item"},
  amount: {type: Number, required: true, default: 0.00},
  date_created: {type: Date},
  date_modififed: {type: Date}
});


module.exports = mongoose.model('Transaction', TransactionSchema);
