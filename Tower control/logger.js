var amqp   = require('amqplib/callback_api');
var config = require('./config');

var chch = null;
var q = config.get('rabbitmq:queue');

var initLogger = (cb) =>
{
  amqp.connect(`amqp://${config.get('rabbitmq:server')}`, function(err, conn)
  {
    conn.createChannel(function(err, ch)
    {
      if (ch)
      {
        chch = ch;

        chch.assertQueue(q);

        if (cb)
        cb();
      }
    });
    //setTimeout(function() { conn.close(); }, 500);
  });

}

var log = (status, message) =>
{
  chch.sendToQueue(q, new Buffer(JSON.stringify(
    {
      'component': config.get('logger:component'),
      'status': status,
      'text': message
    })));
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
    'initLogger': initLogger,
    'logError': lorError,
    'logInformation': logInformation
  }


  ///
  /*var amqp   = require('amqplib/callback_api');
  var config = require('./config');

  var q = config.get('rabbitmq:queue');

  var log = (status, message) =>
  {
  amqp.connect(`amqp://${config.get('rabbitmq:server')}`, function(err, conn)
  {
  conn.createChannel(function(err, ch)
  {
  if (ch)
  {

  ch.assertQueue(q);

  ch.sendToQueue(q, new Buffer(JSON.stringify(
  {
  'component': config.get('logger:component'),
  'status': status,
  'text': message
})));
}
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
*/
