const User = require('./users.model');
const Account = require('../account/account.model');

module.exports = (req, res) => {
  // res.status(200).send('works');

  const newAccount = new Account({
    userId: req.params.userId,
  });

  // save to mongo
  newAccount.save((err, account) => {
    if (err) {
      return res.status(400).json({success: false}, {message: err});
    } else {
      updateUser(account._id);
      // res.status(200).send(account);
    }
  });

  // eslint-disable-next-line require-jsdoc
  function updateUser(accountId) {
    User.findByIdAndUpdate(
        req.params.id,
        {account: accountId},
        {new: true, runValidators: true},
        function(err, data) {
          if (err) return res.status(400).send(err);
          else if (!data) return res.status(404).send('User doesn\'t exist');
          else return res.status(200).send(data);
        }
    );
  }
};
