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

function doGlucose() {
	console.log("wtf");

	$.get('/api/glucose',function(data){
		console.log(data);
	})
	.success(function(data) {
		console.log(data);
	})
	.error(function(data){
		console.log(err);
	});
	//chart stuff 
	var ctx2 = document.getElementById("glucoseChart").getContext("2d");

	var data = {
	    labels: ["January", "February", "March", "April", "May", "June", "July"],
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: [65, 59, 80, 81, 56, 55, 40]
	        },
	        {
	            label: "My Second dataset",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [28, 48, 40, 19, 86, 27, 90]
	        }
	    ]
	};

	var options = {
		scaleFontColor: "#FFF",
		scaleGridLineColor: "#848484"
	}
	var myLineChart = new Chart(ctx2).Line(data, options);

	//summary stuff
	var c = $('#glucoseCanvas');
	var ctx = c[0].getContext("2d");
	var valueTop = c.data('valueTop');
	var valueBot = c.data('valueBot');

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
		ctx.beginPath();
		ctx.moveTo(0,65);
		ctx.lineTo(100,65);
		ctx.strokeStyle = "#D8D8D8";
		ctx.stroke();
	}
}


function doExercise() {
	//chart stuff 
	var ctx2 = document.getElementById("exerciseChart").getContext("2d");

	var data = {
	    labels: ["January", "February", "March", "April", "May", "June", "July"],
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: [65, 59, 80, 81, 56, 55, 40]
	        },
	        {
	            label: "My Second dataset",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [28, 48, 40, 19, 86, 27, 90]
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
	var value = c.data('value');

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
}

function doBloodPressure() {
		//chart stuff 
		var ctx2 = document.getElementById("bloodChart").getContext("2d");

		var data = {
		    labels: ["January", "February", "March", "April", "May", "June", "July"],
		    datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [65, 59, 80, 81, 56, 55, 40]
		        },
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 40, 19, 86, 27, 90]
		        }
		    ]
		};

		var options = {
			scaleFontColor: "#D8D8D8",
		scaleGridLineColor: "#848484"
		}
		var myLineChart = new Chart(ctx2).Line(data, options);

	//summary stuff
	var c = $('#bloodCanvas');
	var ctx = c[0].getContext("2d");
	var value = c.data('value');

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
		ctx.fillText(value + " bpm",50,90);
	}
}


});

