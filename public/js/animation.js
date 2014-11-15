function showContent(element) {

	var module = $(element).parent().parent().parent();

	module.find('a').each(function() {
		$(this).css('color','#FFF');
	});
	$(element).parent().addClass('active');
	$(element).css('color','#6E6E6E');

	module.find('.displayableContent').each(function() {
		$(this).css('display','none');
	});
	module.find($(element).data('show')).each(function() {
		$(this).css('display','block');
	});
}

$(function() {
	$('#siteContainer').css('opacity','1');

	var summaryBP, summaryExercise, summaryGlucose;
	var notifications = [];

	doBloodPressure();
	doExercise();
	doGlucose();
	setTimeout(function(){
		setupNotifications();
		doNotifications();
	},500);
	


function setupNotifications() {
	if(summaryGlucose != undefined){
		var glucose = {};
		var point = summaryGlucose;
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
			notifications.push(glucose);
		}

		if(summaryBP != undefined) {
		var sys = summaryBP.split('/')[0];
		var dys = summaryBP.split('/')[1];
		var bp = {};

		if (sys<=120 && dys<=80){
		bp.description = "Your blood pressure is great!";
		bp.level = 1
	}else if ((sys>=140 && sys<159)||(dys>90 && dys<99)){
		bp.level = 2;
		bp.description = "You are in Stage 1 Hypertension!";
	}else if (sys > 160 || dys > 100){
		bp.level = 3;
		bp.description = "You are in Stage 2 Hypertension! Seek help!"
	}
	notifications.push(bp);	
	}

	if(summaryExercise != undefined) {
		var exercise = {};
	var point = summaryExercise;
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
	notifications.push(exercise);
	}

}

function doNotifications() {
	var notificationContainer = $('#notificationContainer');

	for(i = 0; i < notifications.length; i++) {
		var element = document.createElement('p');
		$(element).text(notifications[i].description);

		if(notifications[i].level == 1) {
			$(element).addClass('alert alert-success');
			$(element).css('background-color','rgba(4,180,95,0.8)');
			//$(element).css('color','#3c763d');
			$(element).css('color','#FFF');
			$(element).css('font-size','20pt');
		}
		else if(notifications[i].level == 2) {
			$(element).addClass('alert alert-warning');
			$(element).css('background-color','rgba(245,209,93,0.8)');
			$(element).css('color','#FFF');
			$(element).css('font-size','20pt');
		}
		else if(notifications[i].level == 3) {
			$(element).addClass('alert alert-danger');
			$(element).css('background-color','rgba(247,129,129,0.8)');
			$(element).css('color','#FFF');
			$(element).css('font-size','20pt');
		}

		notificationContainer.append(element);
	}
	
	/*$.get('/api/notifications',function(res){
		//console.log(res);
	})
	.success(function(res) {

		var notificationContainer = $('#notificationContainer');
		var notifications = res;
		console.log(res);
		for(i = 0; i < notifications.length; i++) {
			var element = document.createElement('p');
			$(element).text(notifications[i].description);

			if(notifications[i].level == 1) {
				$(element).addClass('alert alert-success');
				$(element).css('background-color','rgba(4,180,95,0.8)');
				//$(element).css('color','#3c763d');
				$(element).css('color','#FFF');
				$(element).css('font-size','20pt');
			}
			else if(notifications[i].level == 2) {
				$(element).addClass('alert alert-warning');
				$(element).css('background-color','rgba(245,209,93,0.8)');
				$(element).css('color','#FFF');
				$(element).css('font-size','20pt');
			}
			else if(notifications[i].level == 3) {
				$(element).addClass('alert alert-danger');
				$(element).css('background-color','rgba(247,129,129,0.8)');
				$(element).css('color','#FFF');
				$(element).css('font-size','20pt');
			}

			notificationContainer.append(element);
		}

	})
	.error(function(data){
		//console.log(err);
	});*/
}

function doBloodPressure() {

	$.get('/api/bp',function(res){
		//console.log(res);
	})
	.success(function(res) {
		//console.log(res);

		if(res.monitor == 1) {
	
			//graph stuff
			for(x = 1; x < res.values.length; x++) {
				var column = document.createElement('div');
				$(column).addClass('col-md-2');
				if(x != 1) 
					$(column).css('border-left','1px solid #FFF');
				var top = document.createElement('p');
				$(top).text(res.values[x].split('/')[0]);
				$(top).css('border-bottom','1px solid #FFF');
				$(top).css('color','#FFF');
				$(top).css('font-size','32pt');
				$(top).css('text-align','center');
				var bot = document.createElement('p');
				$(bot).text(res.values[x].split('/')[1]);
				$(bot).css('color','#FFF');
				$(bot).css('font-size','32pt');
				$(bot).css('text-align','center');
				var date = document.createElement('p');
				$(date).text(res.dates[x]);
				$(date).css('color','#FFF');
				$(date).css('font-size','24pt');
				$(date).css('text-align','center');
				$(column).append(top);
				$(column).append(bot);
				$(column).append(date);
				$('#bloodContainer').append(column);
			}
			//summary stuff
			var c = $('#bloodCanvas');
			var ctx = c[0].getContext("2d");
			//var valueTop = c.data('valueTop');
			//var valueBot = c.data('valueBot');
			summaryBP = res.summaryPoint;
			var valueTop = res.summaryPoint.split('/')[0];
			var valueBot = res.summaryPoint.split('/')[1];

			var i = 0;
			var j = 0;
			var drawLoop = setInterval(function(){
				draw(c,i,j);
				if(i < valueTop) {
					i = i + 2;
				}
				if(j < valueBot) {
					j++;
				}
				if(i > valueTop && j > valueBot) {
					clearInterval(drawLoop);
				}
			},10);

			function draw(canvas, valueTop, valueBot) {
				ctx.clearRect(0,0,canvas.width(),canvas.height());
				ctx.fillStyle = "#FFF";
				ctx.font = "70px Helvetica Neue";
				ctx.fillText(valueTop,0,60);
				ctx.fillText(valueBot,20,120);
				ctx.font = "50px Helvetica Neue";
				ctx.fillText("mm/Hg",110,90)
				ctx.beginPath();
				ctx.moveTo(0,65);
				ctx.lineTo(100,65);
				ctx.strokeStyle = "#D8D8D8";
				ctx.stroke();
			}
		} else {
			$('#bloodPressureModule').css('display','none');
		}
	})
	.error(function(data){
		//console.log(err);
	});
}


function doExercise() {

	$.get('/api/exercise',function(data){
		//console.log(data);
	})
	.success(function(res) {
		//console.log(res);

		if(res.monitor == 1) {
			//chart stuff 

			var ctx2 = document.getElementById("exerciseChart").getContext("2d");

			var data = {
			    labels: res.dates,
			    datasets: [
			        {
			            label: "Steps",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(220,220,220,1)",
			            pointColor: "rgba(220,220,220,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.values
			        }
			    ]
			};

			var options = {
				scaleFontColor: "#FFF",
				scaleGridLineColor: "#848484"
			}
			var myLineChart = new Chart(ctx2).Line(data, options);

			//summary stuff
			var c = $('#exerciseCanvas');
			var ctx = c[0].getContext("2d");
			//var value = c.data('value');
			summaryExercise = res.summaryPoint;
			var value = res.summaryPoint;

			var i = 0;
			var drawLoop = setInterval(function(){
				draw(c,i);
				i = i + 10;
				if(i > value) {
					clearInterval(drawLoop);
				}
			},10);

			function draw(canvas, value) {
				ctx.clearRect(0,0,canvas.width(),canvas.height());
				ctx.fillStyle = "#FFF";
				ctx.font = "70px Helvetica Neue";
				ctx.fillText(value + " steps",0,90);
			}
		} else {
			$('#exerciseModule').css('display','none');
		}
	})
	.error(function(data){
		//console.log(err);
	});
}

function doGlucose() {

	$.get('/api/glucose',function(data){
		//console.log(data);
	})
	.success(function(res) {
		//console.log(res);

		if(res.monitor == 1) {
			//chart stuff 
			var ctx2 = document.getElementById("preGlucoseChart").getContext("2d");

			var data = {
			    labels: res.dates,
			    datasets: [
			        {
			            label: "Breakfast",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(4,180,95,1)",
			            pointColor: "rgba(4,180,95,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.breakfastPre
			        },
			        {
			            label: "Lunch",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(0,128,255,1)",
			            pointColor: "rgba(0,108,255,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.lunchPre
			        },
			        {
			            label: "Dinner",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(213,83,79,1)",
			            pointColor: "rgba(213,83,79,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.dinnerPre
			        },
			    ]
			};

			var options = {
				scaleFontColor: "#D8D8D8",
				scaleGridLineColor: "#848484",
				legendTemplate : '<div style=\"position: relative; top: -225px; left: 580px\">'
				                  +'<% for (var i=0; i<datasets.length; i++) { %>'
				                    +'<div>'
				                    +'<span style=\"margin-right: 5px; background-color:<%=datasets[i].strokeColor%>\">_</span>'
				                    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
				                  +'</div>'
				                +'<% } %>'
				              +'</div>'
			}
			var myLineChart = new Chart(ctx2).Line(data, options);

			var legend = myLineChart.generateLegend();

  			//and append it to your page somewhere
  			$('#preLegend').append(legend);

			ctx2 = document.getElementById("postGlucoseChart").getContext("2d");

			var data = {
			    labels: res.dates,
			    datasets: [
			        {
			            label: "Breakfast",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(4,180,95,1)",
			            pointColor: "rgba(4,180,95,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.breakfastPost
			        },
			        {
			            label: "Lunch",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(0,128,255,1)",
			            pointColor: "rgba(0,108,255,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.lunchPost
			        },
			        {
			            label: "Dinner",
			            fillColor: "rgba(220,220,220,0.2)",
			            strokeColor: "rgba(213,83,79,1)",
			            pointColor: "rgba(213,83,79,1)",
			            pointStrokeColor: "#fff",
			            pointHighlightFill: "#fff",
			            pointHighlightStroke: "rgba(220,220,220,1)",
			            data: res.dinnerPost
			        },
			    ]
			};

			var options = {
				scaleFontColor: "#D8D8D8",
				scaleGridLineColor: "#848484",
				legendTemplate : '<div style=\"position: relative; top: -225px; left: 580px\">'
				                  +'<% for (var i=0; i<datasets.length; i++) { %>'
				                    +'<div>'
				                    +'<span style=\"margin-right: 5px; background-color:<%=datasets[i].strokeColor%>\">_</span>'
				                    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
				                  +'</div>'
				                +'<% } %>'
				              +'</div>'
			}
			myLineChart = new Chart(ctx2).Line(data, options);

			legend = myLineChart.generateLegend();

  			//and append it to your page somewhere
  			$('#postLegend').append(legend);

			//summary stuff
			var c = $('#glucoseCanvas');
			var ctx = c[0].getContext("2d");
			//var value = c.data('value');
			summaryGlucose = res.summaryPoint;
			var value = res.summaryPoint;

			var i = 0;
			var drawLoop = setInterval(function(){
				draw(c,i);
				i++;
				if(i > value) {
					clearInterval(drawLoop);
				}
			},25);

			function draw(canvas, value) {
				ctx.clearRect(0,0,canvas.width(),canvas.height());
				ctx.fillStyle = "#FFF";
				ctx.font = "70px Helvetica Neue";
				ctx.fillText(value + " mg/dL",0,90);
			}
		} else {
			//$('#glucoseModule').css('display','none');
			$('#glucoseModule').css('background-color','#BDBDBD');
			$('#glucoseModule').empty();
			var div = document.createElement('div');
			$(div).css('position','relative');
			$(div).css('width','0');
			$(div).css('height','0');
			var div2 = document.createElement('div');
			$(div2).css('position','absolute');
			$(div2).css('left','225px');
			$(div2).css('top','23px');
			var icon = document.createElement('i');
			$(icon).addClass('fa fa-plus-circle');
			$(icon).css('color','#848484');
			$(icon).css('font-size','250pt');
			$(div2).append(icon);
			$(div).append(div2);
			$('#glucoseModule').append(div);
			var connectBtn = document.getElementById('glucoseModule');
			connectBtn.addEventListener('click', function(e) {

		var options = {
		  publicToken: '876289965adce127a26cddfb2e76c371', // you should have this from the succesful authentication flow
		  clientUserId: encodeURIComponent('ishg'), // can be email or any other unique identifier
		  close: function() {
		    // optional callback that will be called if the user closes the popup 
		    // without connecting any data sources.
		  },
		  error: function(err) {
		    // optional callback that will be called if an error occurs while 
		    // loading the popup.
		    
		    // `err` is an object with the fields: `code`, `message`, `detailedMessage`
		  } 
		}
		HumanConnect.open(options);
	});
		}
	})
	.error(function(data){
		//console.log(err);
	});
}


});

