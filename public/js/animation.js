function showContent(element) {
	console.log(element);

	var module = $(element).parent().parent().parent();
	console.log(module);
	//activeTab[0].removeClass('active');
	//activeTab[0].find('a').css('color','#FFF');
	module.find('a').each(function() {
		$(this).css('color','#FFF');
	});
	$(element).parent().addClass('active');
	$(element).css('color','#6E6E6E');


}

$(function() {

var c = $('#heartRateCanvas');
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



});

