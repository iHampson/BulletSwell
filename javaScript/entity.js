/*
	Entity.js
	Will be the general code base for the
	player entity as well as the enemy entities.
*/

"use strict";

var app = app || {};

app.Entity = function(){
	
	function Entity(xPos,yPos){
		this.x = xPos;
		this.y = yPos;
		this.speed = 10;
		this.type = null;
		// save a sprite?
		// collision bool or an active boolean
	}
	
	Entity.prototype.move = function(direction){
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
	
	Entity.prototype.checkType = function(){
		return this.type;
	}
	
	Entity.prototype.checkEdges = function(width, height){
		if(this.x < 0 || this.y < 0 || this.x > width || this.y > height){
			return true;
		} else{
			return false;
		}
	}
	
	Entity.prototype.write = function(){
		console.log("Type: " + this.type);
		console.log("Position: (" + this.x +"," +this.y + ")");
		console.log("Speed: " + this.speed);
	}
	
	return Entity;
}();