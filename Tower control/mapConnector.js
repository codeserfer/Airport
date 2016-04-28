var HTTPRequest = require('./HTTPRequest');
var connection  = require('./mysqlConnection');
var logger      = require('./logger');
var config      = require('./config');

var getRunways = (req, res) =>
{
  /*
  *
  * 1. Get routes from map;
  * 2. Truncate runways;
  * 3. Push runways to db.
  *
  */

  // 1. Get routes from map.
  HTTPRequest.makeHTTPPostRequest(`http://${config.get('mapConnector:ip')}:${config.get('mapConnector:port')}/MapService/GetPlacesOfType`, function(response)
  {
    if (response)
    {
      // 2. Truncate runways.
      connection.connection.query("truncate table runways", function(err, rows, fields)
      {
        if (!err)
        {
          console.log("ranways has been truncated");

          var runways = [];
          for (var i in response)
          {
            runways.push(`(${response[i]["Id"]})`);
          }

          console.log("runways", runways);

          console.log ("query is", `insert into runways (map_id) values ${runways.join(",")}`);

          // 3. Push runways to db.
          connection.connection.query(`insert into runways (map_id) values ${runways.join(",")}`, function(err, rows, fields)
          {
            if (!err)
            {
              if (res) res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
            }
            else
            {
              console.log('Cant insert into db');
              if (res) res.end(JSON.stringify({'Error': 1, 'Status': "Cant insert into db"}));
            }
          });

        }
        else
        {
          console.log('Cant truncate table runways');
          logger.logError('Cant truncate table runways');
          if (res) res.end(JSON.stringify({'Error': 1, 'Status': "Cant truncate table runways"}));
        }
      });
    }
    else
    {
      console.log("Cant get runways from map! Work with old runways!");
      logger.logError("Cant get runways from map! Work with old runways!");
      if (res) res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
    }
  }, 3);


}

var getParkings = (req, res) =>
{
  /*
  *
  * 1. Get parkings from map;
  * 2. Truncate parkings;
  * 3. Push parkings to db.
  *
  */

  // 1. Get routes from map.
  HTTPRequest.makeHTTPPostRequest(`http://${config.get('mapConnector:ip')}:${config.get('mapConnector:port')}/MapService/GetPlacesOfType`, function(response)
  {
    if (response)
    {
      // 2. Truncate parkings.
      connection.connection.query("truncate table parkings", function(err, rows, fields)
      {
        if (!err)
        {
          console.log("parkings has been truncated");

          var parkings = [];
          for (var i in response)
          {
            parkings.push(`(${response[i]["Id"]})`);
          }

          console.log("parkings", parkings);

          console.log ("query is", `insert into parkings (map_id) values ${parkings.join(",")}`);

          // 3. Push runways to db.
          connection.connection.query(`insert into parkings (map_id) values ${parkings.join(",")}`, function(err, rows, fields)
          {
            if (!err)
            {
              if (res) res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
            }
            else
            {
              console.log('Cant insert into db');
              if (res) res.end(JSON.stringify({'Error': 1, 'Status': "Cant insert into db"}));
            }
          });
        }
        else
        {
          console.log('Cant truncate table parkings! Work with old parkings');
          logger.logError('Cant truncate table parkings! Work with old parkings');
          if (res) res.end(JSON.stringify({'Error': 0, 'Status': "OK"}));
        }
      });
    }
    else
    {
      console.log("Cant get parkings from map! Work with old parkings!");
      logger.logError("Cant get parkings from map! Work with old parkings!");
      if (res) res.end(JSON.stringify({'Error': 1, 'Status': "Cant get parkings from map!"}));
    }
  }, 2);
}

module.exports =
{
  'getRunways': getRunways,
  'getParkings': getParkings
};
