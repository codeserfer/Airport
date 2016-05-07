var config        = require('./config');
var HTTPRequest   = require('./HTTPRequest');

var getId = (req, res) =>
{
  var url = new Buffer(req.params.url, 'base64').toString('ascii');

  //TODO: move to config file
  HTTPRequest.makeHTTPPostRequest(`http://${config.get('CarTowerService:ip')}:${config.get('CarTowerService:port')}/CarTowerService/GetId`, function(response)
  {
    if (response)
    {
      console.log("getId response", response);
      res.end(JSON.stringify(response));
    }
    else
    {
      console.log("Cant connect to CarTowerService");
      if (res) res.end(JSON.stringify(0));
    }
  }, url);
}

var holdRoute = (req, res) =>
{
  var q =
  {
  	"CarId": parseInt(req.params.id),
  	"Route":
    {
  		"From":
      {
  			"Id": parseInt(req.params.from)
  		},
  		"To":
      {
  			"Id": parseInt(req.params.to)
  		}
	   }
  }

  //TODO: move to config file
  HTTPRequest.makeHTTPPostRequest(`http://${config.get('CarTowerService:ip')}:${config.get('CarTowerService:port')}/CarTowerService/HoldRoute`, function(response)
  {
    console.log("HoldRoute response", response);

    res.end(JSON.stringify(response));
  }, q);
}

var releaseRoute = (req, res) =>
{
  var q =
  {
  	"CarId": parseInt(req.params.id),
  	"Route":
    {
  		"From":
      {
  			"Id": parseInt(req.params.from)
  		},
  		"To":
      {
  			"Id": parseInt(req.params.to)
  		}
	   }
  }

  //TODO: move to config file
  HTTPRequest.makeHTTPPostRequest(`http://${config.get('CarTowerService:ip')}:${config.get('CarTowerService:port')}/CarTowerService/ReleaseRoute`, function(response)
  {
    console.log("ReleaseRoute response", response);

    res.end(JSON.stringify(response));
  }, q);
}


module.exports =
{
  'getId': getId,
  'holdRoute': holdRoute,
  'releaseRoute': releaseRoute
}
