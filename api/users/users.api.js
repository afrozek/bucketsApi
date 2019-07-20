// const ObjectId = require('mongodb').ObjectID;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import User from './users.model';
import updateUser from './updateUser.controller';

// api routes
const usersApiModule = (express) => {
  const usersApi = express.Router();

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
  User.find({}, {password: 0}, (err, users) => {
    if (!err) {
      return res.status(200).json({
        data: {
          kind: 'user',
          totalItems: users.length,
          items: users,
        },
      });
    }
    return res.status(400).json({error: err});
  }).populate('account');
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
      return res.status(200).json({
        error: {
          code: 404,
          message: 'A user with that Email does not exist',
        },
      });
    }

    // email exists, verify the password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        throw err;
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
        message = `${field} is a required field`;
        return res.status(400).json({success: false, message});
      }
    }
  }

  // check for duplicate email values
  User.find({email: form.email}, (err, data) => {
    if (err) {
      res.status(400).json(err);
    } else if (data.length >= 1) {
      return res
          .status(200)
          .json({
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
      return res.status(400).json({success: false}, {message: err});
    }
    res.status(200).json({success: true, message: 'User Created', user});
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

export default usersApiModule;
