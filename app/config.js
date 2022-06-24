// Application configuration.
'use strict';

var config = module.exports;

const sRedisToken = process.env.REDIS_TOKEN || '';
const sEnvironment = process.env.NODE_ENV || '';

config.db = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT
};

config.redis = {
   host: process.env.REDIS_HOST,
   port: process.env.REDIS_PORT,
   password: process.env.REDIS_PASSWORD,
   path: process.env.SOCKETPATH
};

config.queryTimeout = 1000;
config.redisToken = sRedisToken;

var userRoles = config.userRoles = {
    guest: 1, // ...001
    user: 2, // ...010
    admin: 4 // ...100
};

config.default = {};
config.default['environment'] = sEnvironment;

config.accessLevels = {
    guest: userRoles.guest | userRoles.user | userRoles.admin, // ...111
    user: userRoles.user | userRoles.admin, // ...110
    admin: userRoles.admin // ...100
};