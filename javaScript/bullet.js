/*
	Bullet.js
	Will have the logic to move bullets
	and check for their collisions
*/
"use strict";

var app = app || {};

app.Bullet = function(){

	function Bullet(x,y,radius,speed,color){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
		this.fill = color;
	}

	var proto = Bullet.prototype;

	proto.update = function(dt){
		this.y += this.speed * dt*10;
	}

	proto.checkCollision = function(other){
		var dx = (other.x-this.x)*(other.x-this.x);
		var dy = (other.y-this.y)*(other.y-this.y);
		var dist = dx+dy;
		var test = this.radius+other.radius;
		if(dist <= test*test){
			return true;
		}else{
			return false;
		}
	}

	proto.draw = function(ctx){
		ctx.save();
		ctx.fillStyle = this.fill;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fill();
		ctx.restore();
	}

	return Bullet
}();
