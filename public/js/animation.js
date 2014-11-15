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
	doBloodPressure();
	doExercise();
	doGlucose();

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
			$('#glucoseModule').css('display','none');
		}
	})
	.error(function(data){
		//console.log(err);
	});
}


});

