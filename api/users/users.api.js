// const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('./users.model');
const updateUser = require('./updateUser.controller');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../../config/keys');

passport.use(
    new GoogleStrategy(
        {
          clientID: keys.googleClientId,
          clientSecret: keys.googleClientSecret,
          callbackURL: '/api/users/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
          console.log('accessToken: ', accessToken);
          console.log('refreshToken: ', refreshToken);
          console.log('profile: ', profile);
        }
    )
);

const Transaction = require('../transaction/transaction.model');
const Account = require('../account/account.model');

// api routes
const usersApiModule = (express) => {
  const usersApi = express.Router();

  usersApi.use('/docs', swaggerUi.serve);
  usersApi.get('/docs', swaggerUi.setup(swaggerDocument));

  usersApi.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: ['profile', 'email'],
      })
  );

  usersApi.get('/auth/google/callback', passport.authenticate('google'));

  // login
  usersApi.post('/login', login);
  usersApi.post('/', signup);
  usersApi.get('/', getUsers);
  usersApi.put('/:id', updateUser);

  // middleware
  // var authApi = require('./auth.api.js')(express);
  // usersApi.use(authApi);

  return usersApi;
};

/* Methods */

const getUsers = (req, res) => {
  // return all users , except password field
  User.find({}, {password: 0})
      .populate({
        path: 'account',
        // model: 'Account',
        populate: {
          path: 'transactions',
        },
      })
      .exec((err, data) => {
        if (!err) {
          res.status(200).send(data);
        // return res.status(200).json({
        //   data: {
        //     kind: 'user',
        //     totalItems: users.length,
        //     items: users,
        //   },
        // });
        } else return res.status(400).json({error: err});
      });
};

const login = (req, res) => {
  console.log('loginAPI');
  // extract reqbody data
  const {email} = req.body;
  const {password} = req.body;

  // search for user email
  User.findOne({email}, (err, user) => {
    if (err) throw err;

    // if email doesnt exist
    if (!user) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'A user with that Email does not exist',
        },
      });
    } else {
      // email exists, verify the password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(401).json({success: false, message: err});
        } else if (isMatch) {
          createSendToken(user, res);
        } else {
          return res.status(400).json({
            error: {
              code: 400,
              message: 'Incorrect Password',
            },
          });
        }
      }); // end compare
    } // end else
  }); // end find
}; // end login

// signup
const signup = (req, res) => {
  // extract reqbody data
  // gen info
  const form = {};
  form.email = req.body.email;
  form.password = req.body.password;

  // check for empty fields
  for (const field in form) {
    if (form.hasOwnProperty(field)) {
      if (!form[field]) {
        const message = `${field} is a required field`;
        return res.status(400).json({success: false, message});
      }
    }
  }

  // check for duplicate email values
  User.find({email: form.email}, (err, data) => {
    if (err) {
      return res.status(400).json(err);
    } else if (data.length >= 1) {
      return res.status(200).json({
        success: false,
        message: 'a user with that email already exists',
      });
    }
  }); // end find

  // everything checks out!
  // new user object
  const newUser = new User({
    email: form.email,
    password: form.password,
    dateCreated: Date(),
  });

  // save to mongo
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json({success: false, message: err});
    } else {
      return res.status(200).json({success: true, message: 'User Created', user});
    }
  });
}; // end post addUser

const createSendToken = (user, res, message) => {
  const payload = {
    // iss: req.hostname,
    userId: user.id,
    email: user.email,
  };

  const secret = 'xdS&#((*#@)DKS()#@!@';

  const options = {
    expiresIn: '2 days',
  };

  jwt.sign(payload, secret, options, (err, token) => {
    if (err) {
      res.status(500).json({
        error: {
          code: 500,
          message: 'error creating token',
        },
      });
    } else {
      res.status(200).json({
        data: {
          token,
          message: 'login success!',
        },
      });
    }
  });
};

module.exports = usersApiModule;
