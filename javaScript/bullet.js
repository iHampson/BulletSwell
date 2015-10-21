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
		this.y += this.speed * dt;
	}
	
	proto.checkCollision = function(other){
		var dist = this.x*this.x + this.y*this.y;
		if(dist <= this.radius+other.radius){
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