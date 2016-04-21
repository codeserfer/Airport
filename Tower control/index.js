var express      = require('express');
var runways      = require('./runways');
var parking      = require('./parking');
var config       = require('./config');
var http         = require('http');
var carTower     = require('./carTower');
var mapConnector = require('./mapConnector');


var app = express();

// Get runways
mapConnector.getRunways();

// Get parkings
mapConnector.getParkings();

// Runways
app.get('/api/listRunways', runways.listRunways);
app.get('/api/holdRunway/:runway_id/:plane_id', runways.holdRunway);
app.get('/api/realizeRunway/:runway_id', runways.realizeRunway);
app.get('/api/deleteRunway/:id', runways.deleteRunway);
app.get('/api/requestLanding/:plane_id', runways.holdFreeRunway);
app.get('/api/getPlanesRunway/:plane_id', runways.getPlanesRunway);
app.get('/api/getRunways', mapConnector.getRunways);

// Parkings
app.get('/api/listParkings', parking.listParkings);
app.get('/api/holdParking/:parking_id/:plane_id', parking.holdParking);
app.get('/api/realizeParking/:parking_id', parking.realizeParking);
app.get('/api/deleteParking/:id', parking.deleteParking);
app.get('/api/holdFreeParking/:plane_id', parking.holdFreeParking);
app.get('/api/getParkings', mapConnector.getParkings);



var server = app.listen(3228, function ()
{
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
});
