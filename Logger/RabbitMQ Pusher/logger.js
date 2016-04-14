var amqp   = require('amqplib/callback_api');
var config = require('./config');


var log = (status, message) =>
{
  amqp.connect(`amqp://${config.get('rabbitmq:server')}`, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = "logger_queue";

      ch.assertQueue(q);
      ch.sendToQueue(q, new Buffer(JSON.stringify({'component': "tower_control", 'status': status, 'text': message})));
    });
    setTimeout(function() { conn.close(); }, 500);
  });
}


var lorError = (message) =>
{
  log("error", message);
}

var logInformation = (message) =>
{
  log("information", message);
}

module.exports =
{
  'lorError': lorError,
  'logInformation': logInformation
}
