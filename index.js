var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/bubble_online_ff', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/bubble_online_ff.html'));
});

app.get('/bubble_online_ff_covid', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/bubble_online_ff_covid.html'));
});

app.use('/public',express.static(__dirname+'/views/public'));

app.listen(3000);