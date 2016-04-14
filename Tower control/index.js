var express    = require('express');
var runways    = require('./runways');
var parking    = require('./parking');

var app = express();

app.get('/api/listRunways', runways.listRunways);
app.get('/api/holdRunway/:runway_id/:plane_id', runways.holdRunway);
app.get('/api/realizeRunway/:runway_id', runways.realizeRunway);
app.get('/api/deleteRunway/:id', runways.deleteRunway);
app.get('/api/requestLanding/:plane_id', runways.holdFreeRunway);


app.get('/api/listParkings', parking.listParkings);
app.get('/api/holdParking/:parking_id/:plane_id', parking.holdParking);
app.get('/api/realizeParking/:parking_id', parking.realizeParking);
app.get('/api/deleteParking/:id', parking.deleteParking);
app.get('/api/holdFreeParking/:plane_id', parking.holdFreeParking);

app.get('/api/registerPlane', function (req, res)
{
  res.end(JSON.stringify(registerPlane()));
});

app.get("/api/getId", function(req, res)
{
  res.end(JSON.stringify(123));
});

app.get("/api/HoldRoute/:from/:to", function(req, res)
{
  res.end(JSON.stringify({"status": "No such route", "error": 1}));
});

app.get("/api/ReleaseRoute/:from/:to", function(req, res)
{
  res.end(JSON.stringify({"status": "OK", "error": 0}));
});

var server = app.listen(3228, function ()
{
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
});
