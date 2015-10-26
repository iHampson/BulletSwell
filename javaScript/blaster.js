/*
	Blaster.js
	will be the generic class to contain all code for
	the shooting of bullets. Will track what kind of
	blaster it is and setup and shoot bullets for it.
*/

"use strict";

var app = app || {};

app.Blaster = function(){

	// Shots: number of shots per launch
	// Type: what kind of blaster is this(cannon, mutiShot, shotgun)
	// Spread: how spread out should the shouts be from each other
	// Rate: rate of fire
	// Dir: direction to shoot + is down, - is up
	function Blaster(shots, type, spread, rate, dir){
		this.shotNumber = shots;
		this.type = type;
		this.spread = spread;
		this.rate = rate;
		this.reload = 0;
		this.ready = true;
		this.dir = dir;
	}

	var proto = Blaster.prototype;

	proto.shoot = function(ship,destination){

		if(this.ready){
			app.game.sound.playEffect();
			switch(this.type){
				case "cannon":
					destination.push(new app.game.bullet(ship.x,ship.y,40,10*this.dir,'#F28080'));
					this.ready = false;
					//console.log("bullet Fired");
					break;
				case "multishot":
					for(var i=0; i < shots;i++){
						destination.push(new app.game.bullet((ship.x - spread/2)+i*spread/2,ship.y,8,15*this.dir,'#00E600'));
					}
					this.ready = false;
					//console.log("bullet Fired");
					break;
				default:
					destination.push(new app.game.bullet(ship.x,ship.y,10,15*this.dir,'white'));
					this.ready = false;
					//console.log("bullet Fired");
			}
		}else{
			//console.log("Blaster not ready. " + this.reload.toFixed(2) + " seconds remaining");
		}
	}

	proto.update = function(dt){
		if(!this.ready){
			this.reload += dt*10;
			if(this.reload >= this.rate){
				this.ready = true;
				this.reload = 0;
			}
		}
	}

	return Blaster;
}();
