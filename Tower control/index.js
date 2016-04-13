var express = require('express');
var mysql      = require('mysql');
var config  = require('./config');
var app = express();

var credentials =
{
  'user'     : config.get('db:user'),
  'password' : config.get('db:pass'),
  'database' : config.get('db:database'),
  'port'     : config.get('db:port'),
  'host'     : config.get('db:host')
};

var connection = mysql.createConnection(credentials);


var registerPlane = function ()
{
  // proxy query to Ground control

  return 5;
}


app.get('/api/listRunways', function (req, res)
{
  connection.query("select id, plane_id, map_id from runways", function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify(rows));
    }
    else
    {
      console.log('listRunways: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/holdRunway/:runway_id/:plane_id', function (req, res)
{
  if (!req.params.runway_id || !req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id or runway id"}));
    return;
  }

  connection.query(`update runways set plane_id = ${req.params.plane_id} where id = ${req.params.runway_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log('holdRunway: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/realizeRunway/:runway_id', function (req, res)
{
  if (!req.params.runway_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No runway id"}));
    return;
  }

  connection.query(`update runways set plane_id = NULL where id = ${req.params.runway_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log('realizeRunway: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/deleteRunway/:id', function (req, res)
{
  if (!req.params.id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No route id"}));
    return;
  }

  connection.query(`delete from runways where id = ${req.params.id}`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/holdFreeRunway/:plane_id', function (req, res)
{
  if (!req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id"}));
    return;
  }

  connection.query(`call hold_free_runway(${req.params.plane_id})`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify(rows[0][0]));
    }
    else
    {
      console.log('listParkings: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});


//////////////////
//   Parkings  //
////////////////

app.get('/api/listParkings', function (req, res)
{
  connection.query("select id, plane_id, map_id from parkings", function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify(rows));
    }
    else
    {
      console.log('listParkings: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/holdParking/:parking_id/:plane_id', function (req, res)
{
  if (!req.params.parking_id || !req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id or parking id"}));
    return;
  }

  connection.query(`update parkings set plane_id = ${req.params.plane_id} where id = ${req.params.parking_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log('holdParkings: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/realizeParking/:parking_id', function (req, res)
{
  if (!req.params.parking_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No parking id"}));
    return;
  }

  connection.query(`update parkings set plane_id = NULL where id = ${req.params.parking_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log('realizeParkings: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/deleteParking/:id', function (req, res)
{
  if (!req.params.id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No parkings id"}));
    return;
  }

  connection.query(`delete from parkings where id = ${req.params.id}`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/holdFreeParking/:plane_id', function (req, res)
{
  if (!req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id"}));
    return;
  }

  connection.query(`call hold_free_parking(${req.params.plane_id})`, function(err, rows, fields)
  {
    if (!err)
    {
      res.end(JSON.stringify(rows[0][0]));
    }
    else
    {
      console.log('hold_free_parking: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
});

app.get('/api/registerPlane', function (req, res)
{
  res.end(JSON.stringify(registerPlane()));
});


var server = app.listen(3228, function ()
{

  connection.connect();

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
});
