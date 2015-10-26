// emitter.js
// author: Tony Jefferson
// last modified: 10/7/2015

"use strict";
var app = app || {};

app.Emitter=function(){

	function Emitter(){
		// public
		this.numParticles = 25;
		this.useCircles = true;
		this.useSquares = false;
		this.xRange = 4;
		this.yRange = 4;
		this.minXspeed = -1;
		this.maxXspeed = 1;
		this.minYspeed = 2;
		this.maxYspeed = 4;
		this.startRadius = 4;
		this.expansionRate = 0.3
		this.decayRate = 2.5;
		this.lifetime = 100;
		this.red = 0;
		this.green = 0;
		this.blue = 0;

		// private
		this._particles = undefined;
	};


	// "public" methods
	var p=Emitter.prototype;

	p.createParticles = function(emitterPoint){
		// initialize particle array
		this._particles = [];

		// create exhaust particles
		for(var i=0; i< this.numParticles; i++){
			// create a particle object and add to array
			var par = {};
			this._particles.push(_initParticle(this, par, emitterPoint));
		}

		// log the particles
		//console.log(this._particles );
	};

	p.updateAndDraw = function(ctx, emitterPoint){
			/* move and draw particles */
			// each frame, loop through particles array
			// move each particle down screen, and slightly left or right
			// make it bigger, and fade it out
			// increase its age so we know when to recycle it
			debugger;
			for(var i=0;i<this._particles.length;i++){
				var par = this._particles[i];

				par.age += this.decayRate;
				par.r += this.expansionRate;
				par.x += par.xSpeed
				par.y += par.ySpeed
				var alpha = 1 - par.age/this.lifetime;

				if(this.useSquares){
					// fill a rectangle
					ctx.fillStyle = "rgba(" + this.red + "," + this.green + "," +
					this.blue + "," + alpha + ")";
					ctx.fillRect(par.x, par.y, par.r, par.r);
					// note: this code is easily modified to draw images
				}

				if(this.useCircles){
					// fill a circle
					ctx.fillStyle = "rgba(" + this.red + "," + this.green + "," +
					this.blue + "," + alpha + ")";

					ctx.beginPath();
					ctx.arc(par.x, par.y, par.r, Math.PI * 2, false);
					ctx.closePath();
					ctx.fill();
				}

				// if the particle is too old, recycle it
				if(par.age >= this.lifetime){
					_initParticle(this, par, emitterPoint);
				}
			} // end for loop of this._particles
	} // end updateAndDraw()

	// "private" method
	function _initParticle(obj, p, emitterPoint){

		// give it a random age when first created
		p.age = getRandomInt(0,obj.lifetime);

		p.x = emitterPoint.x + getRandomInt(-obj.xRange, obj.xRange);
		p.y = emitterPoint.y + getRandomInt(0, obj.yRange);
		p.r = getRandomInt(obj.startRadius/2, obj.startRadius); // radius
		p.xSpeed = getRandomInt(obj.minXspeed, obj.maxXspeed);
		p.ySpeed = getRandomInt(obj.minYspeed, obj.maxYspeed);
		return p;
	};


	return Emitter;
}();
