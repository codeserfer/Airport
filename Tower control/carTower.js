var HTTPRequest = require('./HTTPRequest');

var registerPlane = (req, res) =>
{
  res.end(JSON.stringify(registerPlane()));
}

var holdRoute = (req, res) =>
{
  var urlToCall = "http://someip.ru:someport/CarTowerService/GetId";
  HTTPRequest.makeHTTPGetRequest(urlToCall, function(response){
    if (response)
    {
      console.log(response);
      res.end(JSON.stringify(response));
    }
    else
    {
      console.log("Error!");
      res.end(JSON.stringify({"error": 1, "status": "can't make HTTPRequest"}));
    }
  });
}

var releaseRoute = (req, res) =>
{
  res.end(JSON.stringify({"status": "OK", "error": 0}));
}

var getId = (req, res) =>
{
  var urlToCall = "http://someip.ru:someport/CarTowerService/GetId";
  HTTPRequest.makeHTTPGetRequest(urlToCall, function(response){
    if (response)
    {
      console.log(response);
      res.end(JSON.stringify(response));
    }
    else
    {
      console.log("Error!");
      res.end(JSON.stringify({"error": 1, "status": "can't make HTTPRequest"}));
    }
  });
}

var testget = (req, res) =>
{
  res.end(JSON.stringify({"method": "get"}));
}

var testpost = (req, res) =>
{
  console.log (req);
  //res.end(JSON.stringify({"method": "post"}));


  //res.end(JSON.stringify(req['body']));
  res.end(req['body']);
}

var testtest = (req, res) =>
{
  var urlToCall = "http://192.168.0.103:3557/CarTowerService/HoldRoute";
  HTTPRequest.makeHTTPPostRequest(urlToCall, function(response){
    if (response)
    {
      console.log("hey!");
      console.log(response);
      res.end(JSON.stringify(response));
    }
    else
    {
      console.log("Error!");
      res.end(JSON.stringify({"error": 1, "status": "can't make HTTPRequest"}));
    }
  }, {"CarId":1, "Route": {"From": 1, "To": 2}});
}



module.exports =
{
  'registerPlane': registerPlane,
  'getId': getId,
  'testget': testget,
  'testpost': testpost,
  'testtest': testtest,
  'holdRoute': holdRoute,
  'releaseRoute': releaseRoute
};
