/*
	Player.js
*/


"use strict";

var app = app || {};


app.Player = function(){
	Player.prototype = new app.Entity();
	Player.prototype.constructor = Player;
	
	function Player(xPos,yPos,rush){
		this.x = xPos;
		this.y = yPos;
		this.speed = rush;
		this.type = "Player";
		this.cannon = new app.Blaster(1,"base",0,5,-1);
	}
	
	Player.prototype.move = function(dt, direction){
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
	
	Player.prototype.update = function(dt, keys){
		// First, update the reload on the connected blaster
		this.cannon.update(dt);
		
		// Check for user input [Horizontal]
		if(keys.keydown[keys.KEYBOARD.KEY_RIGHT]){
			this.move(dt, "right");
		}else if(keys.keydown[keys.KEYBOARD.KEY_LEFT]){
			this.move(dt, "left");
		}
		// Check for user input [Vertical]
		if(keys.keydown[keys.KEYBOARD.KEY_UP]){
			this.move(dt, "up");
		}else if(keys.keydown[keys.KEYBOARD.KEY_DOWN]){
			this.move(dt, "down");
		}
		
		// Check for user input [Shooting]
		if(keys.keydown[keys.KEYBOARD.KEY_SPACE]){
			this.cannon.shoot(this);
		}
		
	}
	
	Player.prototype.draw = function(ctx){
		ctx.save();
		
		ctx.fillStyle = "green";
		ctx.strokeStyle = "blue";
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, 30, 0,Math.PI*2);
		
		ctx.fill();
		ctx.stroke();
		
		ctx.restore();
	}
	
	return Player;
}();