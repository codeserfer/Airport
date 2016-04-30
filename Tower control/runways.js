var connection = require('./mysqlConnection');
var logger     = require('./logger');

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

var truncateRunways = (req, res) =>
{
  connection.connection.query("update runways set plane_id = NULL", function(err, rows, fields)
  {
    if (!err)
    {
      logger.logInformation("truncate table runways successfuly");
      console.log("truncate table runways successfuly");
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log("Cant truncate table runways");
      logger.logError("Cant truncate table runways");
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
}

var holdRunway = (req, res) =>
{
  if (!req.params.runway_id || !req.params.plane_id)
  {
    logger.logError(`holdRunway: No plane_id or runway_id`);
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id or runway id"}));
    return;
  }

  connection.connection.query(`update runways set plane_id = ${req.params.plane_id} where id = ${req.params.runway_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      logger.logInformation(`holding runway for runway_id ${req.params.runway_id} and plane_id ${req.params.plane_id} is success`);
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      logger.logError(`holding runway for runway_id ${req.params.runway_id} and plane_id ${req.params.plane_id} error!`);
      console.log('holdRunway: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
}

var realizeRunway = (req, res) =>
{
  if (!req.params.runway_id)
  {
    logger.logError(`holdRunway: No runway_id`);
    res.end(JSON.stringify({'Error': 1, 'Status': "No runway id"}));
    return;
  }

  connection.connection.query(`update runways set plane_id = NULL where id = ${req.params.runway_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      logger.logInformation(`runway ${req.params.runway_id} successfuly realized`);
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log('realizeRunway: Error in query');
      logger.logError(`holdRunway: cant realize runway ${runway_id}`);
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
}

var realizeRunwayMap = (req, res) =>
{

  console.log("realizeRunwayMap! req.params.map_id", req.params.map_id);

  if (!req.params.map_id)
  {
    logger.logError(`holdRunway: No map_id`);
    res.end(JSON.stringify({'Error': 1, 'Status': "No map_id"}));
    return;
  }

  connection.connection.query(`update runways set plane_id = NULL where map_id = ${req.params.map_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      logger.logInformation(`map_id ${req.params.map_id} successfuly realized`);
      console.log(`map_id ${req.params.map_id} successfuly realized`);
      res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
    else
    {
      console.log('realizeRunway: Error in query');
      console.log(`update runways set plane_id = NULL where map_id = ${req.params.map_id}`);
      logger.logError(`holdRunway: cant realize map_id ${req.params.map_id}`);
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
      var result = rows[0][0];
      if (result['error'] == 0)
      {
          logger.logInformation(`Hold free runway for planeID ${req.params.plane_id}: ${result['placeId']}`);
      }
      else
      {
        logger.logInformation(`Hold free runway for planeID ${req.params.plane_id}: no free runway`);
      }


      res.end(JSON.stringify(result));
    }
    else
    {
      console.log('listParkings: Error in query');
      res.end(JSON.stringify({'Error': 1, 'Status': "FUCK"}));
    }
  });
}

var getPlanesRunway = (req, res) =>
{
  if (!req.params.plane_id)
  {
    res.end(JSON.stringify({'Error': 1, 'Status': "No plane id"}));
    return;
  }

  connection.connection.query(`select map_id from runways where plane_id = ${req.params.plane_id}`, function(err, rows, fields)
  {
    if (!err)
    {
      var result = rows[0];

      console.log(result);

      if (result)
      {
          result = result['map_id'];
          //logger.logInformation(`Hold free runway for planeID ${req.params.plane_id}: ${result['placeId']}`);
      }
      else
      {
        result = null;
        //logger.logInformation(`Hold free runway for planeID ${req.params.plane_id}: no free runway`);
      }

      res.end(JSON.stringify(result));
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
  'listRunways'     : listRunways,
  'holdRunway'      : holdRunway,
  'realizeRunway'   : realizeRunway,
  'deleteRunway'    : deleteRunway,
  'holdFreeRunway'  : holdFreeRunway,
  'getPlanesRunway' : getPlanesRunway,
  'realizeRunwayMap': realizeRunwayMap,
  'truncateRunways' : truncateRunways
};
