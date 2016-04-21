var amqp   = require('amqplib/callback_api');
var config = require('./config');


var log = (status, message) =>
{
  amqp.connect(`amqp://${config.get('rabbitmq:server')}`, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = config.get('rabbitmq:queue');

      ch.assertQueue(q);
      ch.sendToQueue(q, new Buffer(JSON.stringify({'component': config.get('logger:component'), 'status': status, 'text': message})));
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
  'logError': lorError,
  'logInformation': logInformation
}
