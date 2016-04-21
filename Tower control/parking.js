var connection = require('./mysqlConnection');
var logger     = require('./logger');

var listParkings = (req, res) =>
{
  connection.connection.query("select id, plane_id, map_id from parkings", function(err, rows, fields)
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
}

var holdParking = (req, res) =>
{
  if (!req.params.parking_id || !req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id or parking id"}));
    return;
  }

  connection.connection.query(`update parkings set plane_id = ${req.params.plane_id} where id = ${req.params.parking_id}`, function(err, rows, fields)
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
}

var realizeParking = (req, res) =>
{
  if (!req.params.parking_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No parking id"}));
    return;
  }

  connection.connection.query(`update parkings set plane_id = NULL where id = ${req.params.parking_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      logger.logInformation(`realizing parking for parking_id ${req.params.parking_id} is success`);
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      logger.logError(`realizing parking for parking_id ${req.params.parking_id}: error!`);
      console.log('realizeParkings: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
}

var deleteParking =  (req, res) =>
{
  if (!req.params.id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No parkings id"}));
    return;
  }

  connection.connection.query(`delete from parkings where id = ${req.params.id}`, function(err, rows, fields)
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

var holdFreeParking =  (req, res) =>
{
  if (!req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id"}));
    return;
  }

  connection.connection.query(`call hold_free_parking(${req.params.plane_id})`, function(err, rows, fields)
  {
    if (!err)
    {
      var result = rows[0][0];

      if (result['error'] == 0)
      {
          logger.logInformation(`Hold free parking for planeID ${req.params.plane_id}: ${result['placeId']}`);
      }
      else
      {
        logger.logInformation(`Hold free parking for planeID ${req.params.plane_id}: no free parking`);
      }

      res.end(JSON.stringify(result));
    }
    else
    {
      logger.lorError (`Cant hold parking for planeID ${req.params.plane_id}`)
      console.log('hold_free_parking: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
}


module.exports =
{
  'listParkings'    : listParkings,
  'holdParking'     : holdParking,
  'realizeParking'  : realizeParking,
  'deleteParking'   : deleteParking,
  'holdFreeParking' : holdFreeParking
};
