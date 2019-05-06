/* eslint-disable no-unused-vars */
module.exports = authApi;

const User = require('./users.model.js');
const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');


function authApi(express) {
//   const express = require('express');
  const authApi = express.Router();

  /* -----MIDDLEWARE: CHECKS FOR TOKEN, ADDS DECODED TO REQ OBJECT -----*/
  /* -----MIDDLEWARE: CHECKS FOR TOKEN, ADDS DECODED TO REQ OBJECT -----*/
  /* -----MIDDLEWARE: CHECKS FOR TOKEN, ADDS DECODED TO REQ OBJECT -----*/

  authApi.use((req, res, next) => {
    console.log('Auth API Middleware');
    next();
  });

  authApi.use(function(req, res, next) {
    // first verify the token

    // check for token
    if (!req.headers.token)
      {return res.status(401).json({ success: false, message:'You are not authorized!' })};

    // grab token
    let token = req.headers.token;

    // decode token
    let decoded = jwt.verify(token, 'xdS&#((*#@)DKS()#@!@');


    // check token contents
    if (!decoded.userLevel) return res.status(401).json({success: false, message: 'Authentication Failed'});

    // it checks out, attach decoded to request object for use in other routes
    req.decoded = decoded;


    next();
  });


  // authorize user
  // sends back the profile to verify userlevel on frontend
  authApi.post('/authorize', (req, res) => {
    // grab decoded token from req object, which was set in middleware
    let decoded = req.decoded;


    // send it ova
    res.json({success: true, profile: req.decoded});
  });

  /* -----MIDDLEWARE: CHECKS FOR USERLEVEL PERMISSIONS -----*/
  /* -----MIDDLEWARE: CHECKS FOR USERLEVEL PERMISSIONS -----*/
  /* -----MIDDLEWARE: CHECKS FOR USERLEVEL PERMISSIONS -----*/


  authApi.use((req, res, next) => {
    // then verify the permissions

    // //grab userLevel
    // var userLevel = req.decoded.userLevel;
    // // var userLevel = "hacker";

    // //define permitted users array
    // var allowedUsers = ["superuser", "admin", "author"];

    // //check if current user has permissions
 	// 	var result = allowedUsers.indexOf(userLevel);
 	// 	if(result < 0)
 	// 		return res.status(401).json({ success: false, message:'Authorization Failed' });


    next();
  });

  return authApi;
} // end authApi
