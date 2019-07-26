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
    if (result) {
      res.status(200).send({success: true, message: 'Fetched All Transactions', result});
    } else {
        res.status(400).json({success: false, message: err});    }
  });
}

// eslint-disable-next-line require-jsdoc
function createTransaction(req, res) {
  
    const newTransaction = new Transaction({
    accountId: req.params.accountId,
    name: req.body.name,
    amount: req.body.amount,
  });

  // save to mongo
  newTransaction.save(function(err, transaction) {
    if (err) {
        // res.status(400).send("error");
      res.status(400).json({success: false, message: err});
    } else {
      addTransactionToAccount(transaction);
    }
  });


  function addTransactionToAccount(transaction) {
    console.log('transaction', transaction);
    console.log('transaction.id', transaction.id);
    console.log('req.params.accountId', req.params.accountId);

    Account.findOneAndUpdate(
        {'_id': req.params.accountId},
        {$push: {'transactions': transaction.id}},
        {safe: true, upsert: false, new: true},
        function(err, result) {
          if (err) {
            res.status(400).json({success: false, message: err});
          } else {
            res.status(200).send({success: true, message: 'Transaction Created', data: result});
          }
        }
    );
  }
}; // end createTransaction

module.exports = transactionApiModule;
