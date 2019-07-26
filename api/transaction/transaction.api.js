/* eslint-disable require-jsdoc */
const ObjectId = require('mongodb').ObjectID;

const Account = require('../account/account.model');
const Transaction = require('./transaction.model');

// api routes
const transactionApiModule = (express) => {
  const transactionApi = express.Router();

  transactionApi.post('/account/:accountId/create', createTransaction);
  transactionApi.get('/all', getAll);


  return transactionApi;
};

/* Methods */

function getAll(req, res) {
    Transaction.find({}, function(err, result) {
        if(result){
            res.status(200).send(result)
        }
        else {
            res.status(400).send(err);
        }
    })
}

// eslint-disable-next-line require-jsdoc
function createTransaction(req, res) {
  const newTransaction = new Transaction({
    accountId: req.params.accountId,
    name: "test trans 2",
    amount: 60
  });

  // save to mongo
  newTransaction.save((err, transaction) => {
    if (err) {
      return res.status(400).json({success: false}, {message: err});
    } else {
      addTransactionToAccount(transaction);
    }
  });


  function addTransactionToAccount(transaction) {

    console.log("transaction", transaction)
    console.log("transaction.id", transaction.id)
    console.log("req.params.accountId", req.params.accountId)

    Account.findOneAndUpdate(
        {'_id': req.params.accountId},
        {$push: {'transactions': transaction.id}},
        {safe: true, upsert: true, new: true},
        function(err, result) {
          if (err) {
            res.send(err);
          }
          else {
            return res.status(200).json({success: true, message: 'Transaction Created', result});
          }
        }
    );
  }
}; // end createTransaction

module.exports = transactionApiModule;
