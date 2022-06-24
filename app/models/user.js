// The User model.
'use strict';

var bcrypt = require('bcryptjs');

var   config   = require('../config'),
      knex     = require('../services/database');

const axios = require('axios').default;

const CryptoJS = require('crypto-js');

// Bcrypt functions used for hashing password and later verifying it.
const SALT_ROUNDS = 10;
const hashPassword = password => bcrypt.hash(password, SALT_ROUNDS);
const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

// Always perform this logic before saving to db. This includes always hashing
// the password field prior to writing so it is never saved in plain text.
const beforeSave = user => {
   if (!user.password) return Promise.resolve(user)

   // `password` will always be hashed before being saved.
   return hashPassword(user.password)
   .then(hash => ({ ...user, password: hash }))
   .catch(err => `Error hashing password: ${err}`)
}

const sTableName = 'wmpos_user';
const sWm_user = 'wm_user';
const sReg_card = 'wm_user_reg_card';
const sReg_car = 'wm_user_reg_car';
const sTableOrder = 'wm_order';
const sUser_points = 'wm_user_points';
const sPush_token = 'wm_push_token';

const { v1: uuidv1 } = require('uuid');
const { async } = require('validate.js');

var User = {};


module.exports = User;