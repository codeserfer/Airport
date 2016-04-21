var express     = require('express');

var app = express();


app.get('/passTest', function(req, res)
{
  res.end(JSON.stringify({"method": "gettt"}));
});

app.post('/passTest', function(req, res)
{
  res.end(JSON.stringify({"method": "gettt"}));
});

var server = app.listen(5678, function ()
{
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
});
