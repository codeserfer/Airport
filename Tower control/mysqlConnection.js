var mysql   = require('mysql');
var config  = require('./config');

var credentials =
{
  'user'     : config.get('db:user'),
  'password' : config.get('db:pass'),
  'database' : config.get('db:database'),
  'port'     : config.get('db:port'),
  'host'     : config.get('db:host')
};

var connection = mysql.createConnection(credentials);

connection.connect();

module.exports = {'connection': connection};
