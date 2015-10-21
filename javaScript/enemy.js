/*
	Enemy.js
	holds specifically the enemy class code
*/


"use strict";

var app = app || {};

app.Enemy = function(){
	
	Enemy.prototype = new app.Entity();
	Enemy.prototype.constructor = Enemy;
	
	function Enemy(xPos,yPos,rush){
		this.x = xPos;
		this.y = yPos;
		this.speed = rush;
		this.type = "Enemy";
	}
	
	
	
	Enemy.prototype.move = function(direction){
		switch(direction){
			case "up":
				this.y -= this.speed * dt;
			break;
			case "down":
				this.y += this.speed * dt;
			break;
			case "left":
				this.x -= this.speed * dt;
			break;
			case "right":
				this.x += this.speed * dt;
			break;
		}
	}
	
	return Enemy;
}();