var express       = require('express');
var runways       = require('./runways');
var parking       = require('./parking');
var http          = require('http');
var bodyParser    = require('body-parser')
var carTower      = require('./carTower');    //TODO delete this
var mapConnector  = require('./mapConnector');
var HTTPRequest   = require('./HTTPRequest');
var logger        = require('./logger');
var carTowerProxy = require('./carTowerProxy');


var app = express();

// Get runways
mapConnector.getRunways();

// Get parkings
mapConnector.getParkings();

// Runways
app.get('/api/listRunways', runways.listRunways);
app.get('/api/holdRunway/:runway_id/:plane_id', runways.holdRunway);
app.get('/api/deleteRunway/:id', runways.deleteRunway);
app.get('/api/requestLanding/:plane_id', runways.requestLanding);
app.get('/api/requestTakeoff/:plane_id', runways.requestTakeoff);
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

// carTowerProxy
app.get('/api/getId/:url', carTowerProxy.getId);
app.get('/api/HoldRoute/:id/:from/:to', carTowerProxy.holdRoute);
app.get('/api/ReleaseRoute/:id/:from/:to', carTowerProxy.releaseRoute);


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
