/*
	Enemy.js
	holds specifically the enemy class code
*/


"use strict";

var app = app || {};

app.Enemy = function(){

	Enemy.prototype = new app.Entity();
	Enemy.prototype.constructor = Enemy;

	// xPos: X coordinate
	// yPos: Y coordinate
	// rush: Movement speed
	function Enemy(xPos,yPos,rush){
		this.x = xPos;
		this.y = yPos;
		this.speed = rush;
		this.type = "Enemy";
		this.radius = 40;
		this.moveDir = undefined;
		this.blaster = undefined;
		this.armed = false;

		var dir = Math.random() * 100;
		if(dir%2 === 1){
			this.moveDir = "left";
		}else{
			this.moveDir = "right";
		}
	}

	Enemy.prototype.update = function(dt){
		//	debugger;
		// Auto Movement, always down and left or right
		this.move(dt);

		// Reload blaster and attempt to fire
		if(this.blaster != undefined){
			this.blaster.update(dt);
			this.blaster.shoot(this,app.game.enemyBullets);
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
			case "left":
				this.x -= this.speed * dt;
			break;
			case "right":
				this.x += this.speed * dt;
			break;
		}

		if(this.armed === false){
			this.y += this.speed * dt;
		}
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

	// An arm function to give enemies blasters
	Enemy.prototype.arm = function(){
		this.armed = true;
		this.blaster = new app.Blaster(1,"base",0,12,1);
	}

	return Enemy;
}();
