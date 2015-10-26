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
		this.sprite = sprite({
			width: 257,	height: 93,
			image: document.getElementById('enemySheet'),
			rows: 1, columns: 3
		})

		var dir = Math.random() * 100;
		if(dir%2 === 1){
			this.moveDir = "left";
		}else{
			this.moveDir = "right";
		}
	}

	Enemy.prototype.update = function(dt){
		// Auto Movement, always down and left or right
		this.move(dt);

		// Reload blaster and attempt to fire
		if(this.blaster != undefined){
			this.blaster.update(dt);
			this.blaster.shoot(this,app.game.enemyBullets);
		}

		if(this.x >= app.game.WIDTH - 50){
			this.moveDir = "left";
		}
		if(this.x <= 50){
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

			if(this.moveDir === "right"){
				this.sprite.render(ctx,this.x-45,this.y-30,2,0,this.radius);
			}else{
				this.sprite.render(ctx,this.x-45,this.y-30,0,0,this.radius);
			}

		ctx.restore();
	}

	// An arm function to give enemies blasters
	Enemy.prototype.arm = function(){
		this.armed = true;
		this.blaster = new app.Blaster(1,"base",0,12,1);
	}

	return Enemy;
}();
