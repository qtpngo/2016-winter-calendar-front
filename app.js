var express = require('express');
var app = express();
app.use(express.static(__dirname + '/src/app'));
app.listen(process.env.PORT || 4200);