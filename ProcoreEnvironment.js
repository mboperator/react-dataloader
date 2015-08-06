var env = require('dotenv').config({path: './.env'});
module.exports = {baseUrl: process.env.WEBPACK_SERVER_HOSTNAME};
