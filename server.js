/* Node Server */

var express = require('express');
var path = require('path');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000))
app.use('/public',express.static(__dirname+'/public'));
app.use('/css',express.static(__dirname+'/public/css'));
app.use('/js',express.static(__dirname+'/public/js'));
app.use('/images',express.static(__dirname+'/public/images'));
app.use('/fonts',express.static(__dirname+'/public/fonts'));

app.use(bodyParser.json());

// Routes
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});


//Api
app.get('/api/questions',function(req,res){
	var file = __dirname + '/public/data/data_43210.json';
	var json;
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		res.send(json);
	});
});



var date = new Date();
dd = date.getDate();
mm = date.getMonth() + 1;
yy = date.getFullYear();

app.post('/api/ask',function(req,res){
	var file = __dirname + '/public/data/data_43210.json';
	var json;
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		var length = json.data.length;
		json.data[length] = { 
			"title" : req.body.title,
			"body" : req.body.body,
			"date" : ""+mm+"/"+dd+"/"+yy, 
			"author" : "Danielle Brigida", 
			"votes" : 0, 
			"views" : 0, 
			"answers" : []
		};

		fs.writeFile(file, JSON.stringify(json,undefined,2), function (err) {
			if (err) throw err;
		});
	});

	res.send("OK");
});

app.post('/api/answer',function(req,res){
	var file = __dirname + '/public/data/data_43210.json';
	var json;
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		var length = json.data[1].answers.length;
		json.data[1].answers[length] = { 
			"body" : req.body.body,
			"author" : "Danielle Brigida", 
			"answer_votes" : 0,
		};

		fs.writeFile(file, JSON.stringify(json,undefined,2), function (err) {
			if (err) throw err;
		});
	});

	res.send("OK");
});

app.listen(app.get('port'), function() {
  console.log("Health Dashboard is running at localhost:" + app.get('port'))
});