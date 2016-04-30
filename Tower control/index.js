var express      = require('express');
var runways      = require('./runways');
var parking      = require('./parking');
var http         = require('http');
var bodyParser   = require('body-parser')
var carTower     = require('./carTower');
var mapConnector = require('./mapConnector');
var HTTPRequest  = require('./HTTPRequest');
var logger       = require('./logger');


var app = express();

// Get runways
mapConnector.getRunways();

// Get parkings
mapConnector.getParkings();

// Runways
app.get('/api/listRunways', runways.listRunways);
app.get('/api/holdRunway/:runway_id/:plane_id', runways.holdRunway);
app.get('/api/deleteRunway/:id', runways.deleteRunway);
app.get('/api/requestLanding/:plane_id', runways.holdFreeRunway);
app.get('/api/getPlanesRunway/:plane_id', runways.getPlanesRunway);
app.get('/api/getRunways', mapConnector.getRunways);
app.get('/api/realizeRunway/:runway_id', runways.realizeRunway);
app.get('/api/realizeRunway/Map/:map_id', runways.realizeRunwayMap);
app.get('/api/truncateRunways', runways.truncateRunways);

// Parkings
app.get('/api/listParkings', parking.listParkings);
app.get('/api/holdParking/:parking_id/:plane_id', parking.holdParking);
app.get('/api/deleteParking/:id', parking.deleteParking);
app.get('/api/holdFreeParking/:plane_id', parking.holdFreeParking);
app.get('/api/getParkings', mapConnector.getParkings);
app.get('/api/realizeParking/:parking_id', parking.realizeParking);
app.get('/api/realizeParking/Map/:map_id', parking.realizeParkingMap);
app.get('/api/truncateParkings', parking.truncateParkings);

app.get('/api/getId/:url', (req, res) =>
{
  var url = new Buffer(req.params.url, 'base64').toString('ascii');

  //TODO: move to config file
  HTTPRequest.makeHTTPPostRequest(`http://10.128.0.10:3557/CarTowerService/GetId`, function(response)
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
});


app.get('/api/HoldRoute/:id/:from/:to', (req, res) =>
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
  HTTPRequest.makeHTTPPostRequest(`http://10.128.0.10:3557/CarTowerService/HoldRoute`, function(response)
  {
    console.log("HoldRoute response", response);

    res.end(JSON.stringify(response));
  }, q);
});


app.get('/api/ReleaseRoute/:id/:from/:to', (req, res) =>
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
  HTTPRequest.makeHTTPPostRequest(`http://10.128.0.10:3557/CarTowerService/ReleaseRoute`, function(response)
  {
    console.log("ReleaseRoute response", response);

    res.end(JSON.stringify(response));
  }, q);
});


logger.initLogger (() =>
{
  var server = app.listen(3228, function ()
  {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port);
    logger.logInformation("Control tower has been started!");
  });
});
