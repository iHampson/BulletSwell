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
		this.radius = 40;
		this.moveDir = "right";
	}

	Enemy.prototype.update = function(dt){
		debugger;
		switch(this.moveDir){
			case "left":
				this.move(dt);
				break;
			case "right":
				this.move(dt);
				break;
		}

		if(this.x >= app.game.WIDTH - 70){
			this.moveDir = "left";
		}
		if(this.x <= 70){
			this.moveDir = "right";
		}

	}

	Enemy.prototype.move = function(dt){
		switch(this.moveDir){
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
		console.log("Position: (" + Math.floor(this.x) + ", " + Math.floor(this.y) + ")");
	}

	Enemy.prototype.draw = function(ctx){
		ctx.save();

			ctx.fillStyle = "#BF0B0B";
			ctx.strokeStyle = "#209CC3";
			ctx.lineWidth = 3;

			ctx.beginPath();
			ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);

			ctx.fill();
			ctx.stroke();
		ctx.restore();
	}

	return Enemy;
}();
