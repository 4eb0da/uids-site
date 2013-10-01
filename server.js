var express = require('express');
var app = express();
var port = 8080;
app.use(express.static('./out'));
app.listen(port);
console.log('Server started with port ' + port);
