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
		this.radius = 25;
		this.speed = rush;
		this.type = "Player";
		this.cannon = new app.Blaster(1,"base",0,5,-1);
		this.sprite = sprite({
			width: 262,	height: 263,
			image: document.getElementById('playerSheet'),
			rows: 3, columns: 3
		});
		this.frameCol = 0;
		this.frameRow = 0;

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
			this.cannon.shoot(this,app.game.playerBullets);
		}

		//Determine which sprite to draw
		if(keys.keydown[keys.KEYBOARD.KEY_RIGHT] && keys.keydown[keys.KEYBOARD.KEY_UP]){
			this.frameCol = 1;			this.frameRow = 0;
		}else if(keys.keydown[keys.KEYBOARD.KEY_RIGHT] && keys.keydown[keys.KEYBOARD.KEY_DOWN]){
			this.frameCol = 0;			this.frameRow = 1;
		}else if(keys.keydown[keys.KEYBOARD.KEY_RIGHT] && keys.keydown[keys.KEYBOARD.KEY_LEFT]){
			this.frameCol = 0;			this.frameRow = 0;
		}else if(keys.keydown[keys.KEYBOARD.KEY_LEFT] && keys.keydown[keys.KEYBOARD.KEY_UP]){
			this.frameCol = 1;			this.frameRow = 2;
		}else if(keys.keydown[keys.KEYBOARD.KEY_LEFT] && keys.keydown[keys.KEYBOARD.KEY_DOWN]){
			this.frameCol = 2;			this.frameRow = 1;
		}else if(keys.keydown[keys.KEYBOARD.KEY_UP]){
			this.frameCol = 0;			this.frameRow = 0;
		}else if(keys.keydown[keys.KEYBOARD.KEY_DOWN]){
			this.frameCol = 1;			this.frameRow = 1;
		}else if(keys.keydown[keys.KEYBOARD.KEY_LEFT]){
			this.frameCol = 0;			this.frameRow = 2;
		}else if(keys.keydown[keys.KEYBOARD.KEY_RIGHT]){
			this.frameCol = 2;			this.frameRow = 0;
		}
	}

	Player.prototype.draw = function(ctx){
		ctx.save();

		this.sprite.render(ctx,this.x,this.y,this.frameCol,this.frameRow,this.radius);

		ctx.restore();
	}

	return Player;
}();
