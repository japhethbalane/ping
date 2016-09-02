//////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById('ping');
var context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const count = 20;
const dim = 20;
const gap = 2;
var metronome = new Metronome(2);
var pings = [];
var audioContext = new AudioContext();
var maxFreq = 1500;

//////////////////////////////////////////////////////////////////////////////

setInterval(world,30);
generatePings();

//////////////////////////////////////////////////////////////////////////////

window.addEventListener("click", function(e) {
   	for (var i = 0; i < pings.length; i++) {
   		if (e.pageX >= pings[i].x && e.pageX <= pings[i].x+dim &&
   			e.pageY >= pings[i].y && e.pageY <= pings[i].y+dim &&
   			!pings[i].isActive) pings[i].isActive = true;
   		else if (e.pageX >= pings[i].x && e.pageX <= pings[i].x+dim &&
   			e.pageY >= pings[i].y && e.pageY <= pings[i].y+dim &&
   			pings[i].isActive) pings[i].isActive = false;
   		else ;//console.log("do nothing!");
   	}
});

//////////////////////////////////////////////////////////////////////////////

function clearCanvas() {
	context.fillStyle = "#111";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function generatePings() {
	var test = Math.floor(maxFreq/count);
	for (var i = canvas.height/2-(((gap+dim)*count)/2), vc = 0;
	 vc < count; i+=(dim+gap), vc++) {
		for (var j = canvas.width/2-(((gap+dim)*count)/2), hc = 0;
		 hc < count; j+=(dim+gap), hc++) {
			pings.push(new Ping(j,i,maxFreq-(test*vc)));
		}
	}
}

function randomBetween(min,max) {
	return Math.floor((Math.random()*(max - min)+min));
}

//////////////////////////////////////////////////////////////////////////////

function world() {
	clearCanvas();
	metronome.update().draw();
	for (var i = 0; i < pings.length; i++) {
		pings[i].update().draw();
	}
}

//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////

function Ping(x,y,ping) {
	this.x = x;
	this.y = y;
	this.ping = ping;
	this.isActive = false;
	this.start = false;
	this.sound = false;


	this.update = function() {
		if (metronome.x >= this.x && metronome.x <= this.x+dim && 
			this.isActive && !this.start) {
			this.oscillator = audioContext.createOscillator();
			this.gain = audioContext.createGain();
			this.oscillator.connect(this.gain);
			this.gain.connect(audioContext.destination);
			this.oscillator.frequency.value = this.ping;
			this.oscillator.start();

			this.start = true;
		}
		if (this.start && 
			(metronome.x < this.x || metronome.x > this.x+dim)) {
			this.oscillator.stop();
			this.start = false;
		}

		return this;
	}

	this.draw = function() {
		context.strokeStyle = "#000";
		context.strokeRect(this.x,this.y,dim,dim);
		context.fillStyle = "#000";
		if (this.isActive) context.fillStyle = "#555";
		if (this.start) context.fillStyle = "#fff";
		context.fillRect(this.x,this.y,dim,dim);
	}
}

function Metronome(s) {
	this.speed = s;
	this.x = canvas.width/2-(((gap+dim)*count)/2);
	this.y = canvas.height/2-(((gap+dim)*count)/2);
	this.initX = this.x;
	this.initY = this.y;

	this.update = function() {
		this.x+=this.speed;
		if (this.x >= canvas.width/2+(((gap+dim)*count)/2)) this.x = this.initX;
		return this;
	}

	this.draw = function() {
		context.strokeStyle = "#777";
		context.beginPath();
		context.moveTo(this.x,0);
		context.lineTo(this.x,canvas.height);
		context.stroke();
	}
}

//////////////////////////////////////////////////////////////////////////////