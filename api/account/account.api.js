const ObjectId = require('mongodb').ObjectID;

// import User from '../users/users.model';
const Account = require('./account.model');

// api routes
const accountApiModule = (express) => {
  const accountApi = express.Router();

  accountApi.post('/user/:userId', createAccount);
  accountApi.get('/all', getAll);


  return accountApi;
};

/* Methods */

function getAll(req, res) {
  Account.find({}, function(err, result) {
      if(result){
          res.status(200).send(result)
      }
      else {
          res.status(400).send(err);
      }
  }).populate('transactions')
}

// eslint-disable-next-line require-jsdoc
function createAccount(req, res) {
  const newAccount = new Account({
    userId: req.params.userId,
  });

  // save to mongo
  newAccount.save((err, user) => {
    if (err) {
      return res.status(400).json({success: false}, {message: err});
    }
    return res.status(200).json({success: true, message: 'Account Created', user});
  });
  
}; // end createAccount

module.exports = accountApiModule;
