var request = require("request");
var config  = require('./config');

var makeHTTPGetRequest = (urlToCall, callback) =>
{
  request(urlToCall, function (err, data, response) {
    if (err)
    {
      return callback(null);
    }
    else
    {
      var statusCode = response.statusCode;

      return callback(JSON.parse(data['body']));
    }
  });
}



var makeHTTPPostRequest = (urlToCall, callback, postParams) =>
{
  request.post(
    {
      headers: {'content-type' : 'application/json'},
      url:     urlToCall,
      body:    JSON.stringify(postParams),
      timeout: config.get('HTTPRequest:timeout'),
    },
    function (err, data, response) {
      if (err)
      {
        console.log("error!", err);
        return callback(null);
      }
      else
      {
        return callback(JSON.parse(response));
        //return callback(JSON.parse(data['request']['body']));
      }
    });
  }

  module.exports =
  {
    'makeHTTPGetRequest': makeHTTPGetRequest,
    'makeHTTPPostRequest': makeHTTPPostRequest
  }
