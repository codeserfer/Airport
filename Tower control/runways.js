var connection = require('./mysqlConnection');

var listRunways =  (req, res) =>
{
  connection.connection.query("select id, plane_id, map_id from runways", function(err, rows, fields)
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
}

var holdRunway = (req, res) =>
{
  if (!req.params.runway_id || !req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id or runway id"}));
    return;
  }

  connection.connection.query(`update runways set plane_id = ${req.params.plane_id} where id = ${req.params.runway_id}`, function(err, rows, fields)
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
}

var realizeRunway = (req, res) =>
{
  if (!req.params.runway_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No runway id"}));
    return;
  }

  connection.connection.query(`update runways set plane_id = NULL where id = ${req.params.runway_id}`, function(err, rows, fields)
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
}

var deleteRunway = (req, res) =>
{
  if (!req.params.id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No route id"}));
    return;
  }

  connection.connection.query(`delete from runways where id = ${req.params.id}`, function(err, rows, fields)
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
}

var holdFreeRunway = (req, res) =>
{
  if (!req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id"}));
    return;
  }

  connection.connection.query(`call hold_free_runway(${req.params.plane_id})`, function(err, rows, fields)
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
}

module.exports =
{
  'listRunways'    : listRunways,
  'holdRunway'     : holdRunway,
  'realizeRunway'  : realizeRunway,
  'deleteRunway'   : deleteRunway,
  'holdFreeRunway' : holdFreeRunway,
};
