/* Node Server */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');
var fs = require("fs");
var path = require('path');
var app = express();

var user = 1;

app.set('port', (process.env.PORT || 5000))
app.use('/public',express.static(__dirname+'/public'));
app.use('/css',express.static(__dirname+'/public/css'));
app.use('/js',express.static(__dirname+'/public/js'));
app.use('/img',express.static(__dirname+'/public/img'));
app.use('/fonts',express.static(__dirname+'/public/fonts'));

app.use(bodyParser.json());

// Routes
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/dash', function(req, res) {
	updateNotifications();
	res.sendFile(path.join(__dirname, '/public/dashboard.html'));	
});

var updateNotifications = function(){
	var json, file, point,meal;
	var write = [];
	var glucose = {};
	
	file = __dirname + '/public/data/u'+user+'/glucose.json';
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		if(json.monitor != 0){
			point = json.summaryPoint;
			meal = json.meal;
			if(meal == "post"){
				if(point>180){
					glucose.description = "Your blood glucose level is high!";
					glucose.level = 3
				}else if (point > 160){
					glucose.description = "Your blood glucose level is OK";
					glucose.level = 2;
				}else{
					glucose.description = "Your blood glucose level is great!"
					glucose.level = 1;
				}
			}else{
				if(point>120){
					glucose.description = "Your blood glucose level is high!";
					glucose.level = 3
				}else if (point < 75){
					glucose.description = "Your blood glucose level is low!";
					glucose.level = 2;
				}else{
					glucose.description = "Your blood glucose level is great!"
					glucose.level = 1;
				}
			}
			write.push(glucose);
		}
	});
	var sys, dys;
	var bp = {};
	file = __dirname + '/public/data/u'+user+'/bp.json';
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		point = json.summaryPoint;
		sys = parseInt(point.substring(0,3));
		dys = parseInt(point.substring(4));
		if (sys<120 && dys<80){
			bp.description = "Your blood pressure is great!";
			bp.level = 1
		}else if ((sys>=140 && sys<159)||(dys>90 && dys<99)){
			bp.level = 2;
			bp.description = "You are in Stage 1 Hypertension!";
		}else if (sys > 160 || dys > 100){
			bp.level = 3;
			bp.description = "You are in Stage 2 Hypertension! Seek help!"
		}
		write.push(bp);
	});
	var exercise = {};
	file = __dirname + '/public/data/u'+user+'/exercise.json';
	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}
		json = JSON.parse(data);
		point = json.summaryPoint;
		if (point < 5000){
			exercise.description = "You haven't walked enough today. Move around more!";
			exercise.level = 3;
		}else if (point > 7000){
			exercise.description = "Great job on fitness today!";
			exercise.level = 1;
		}else{
			exercise.description = "Your movement was average today.";
			exercise.level = 2;
		}
		write.push(exercise);
		file = __dirname + '/public/data/u'+user+'/notification.json';
		fs.writeFile(file, JSON.stringify(write,undefined,2), function (err) {
    		if (err) throw err;
    	});
	});

}


var getGlucose = function(){
	request('https://api.humanapi.co/v1/human/blood_pressure/readings?access_token=demo', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var json = JSON.parse(body);
	    var data = {};
	    data.monitor = 1;
	    data.dates = ["Nov 9","Nov 10", "Nov 11", "Nov 12", "Nov 13", "Nov 14", "Nov 15"];
	    data.values = [];
	    var bp;
	    var i=0;
	    while(i<7){
	    	data.values[i] = json[i].systolic + "/" + json[i].diastolic;
	    	i+=1;
	    }
	    data.summaryPoint = data.values[6];
	    var file = __dirname + '/public/data/u'+user+'/bp.json';
	    fs.writeFile(file, JSON.stringify(data,undefined,2), function (err) {
    		if (err) throw err;
    	});
	  }
	})
}

//Api

app.post('/api/setuser', function(req,res){
	user= req.body.email;
	if (user == "ishmeet@gmail.com"){
		user = 1;
	}else{
		user = 2;
	}
	res.send('Dafuq');
});

app.get('/api/exercise', function(req,res){
	var folder;
	if (user ==1){
		folder = "u1";
	}else{
		folder = "u2";
	}
	var file = __dirname + '/public/data/'+folder+'/exercise.json';
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
app.get('/api/glucose',function(req,res){
	getGlucose();
	var folder;
	if (user ==1){
		folder = "u1";
	}else{
		folder = "u2";
	}
	var file = __dirname + '/public/data/'+folder+'/glucose.json';
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
app.get('/api/bp',function(req,res){
	var folder;
	if (user ==1){
		folder = "u1";
	}else{
		folder = "u2";
	}
	var file = __dirname + '/public/data/'+folder+'/bp.json';
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
app.get('/api/notifications',function(req,res){
	var folder;
	if (user ==1){
		folder = "u1";
	}else{
		folder = "u2";
	}
	var file = __dirname + '/public/data/'+folder+'/notifications.json';
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
