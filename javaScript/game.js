/*
	main singleton object to hold and control game data
	will need properties to hold 

*/
"use strict";

var app = app || {};

// works as an object property to maintain game data
app.game = {
	WIDTH: 700,
	HEIGHT: 800,
	
//  Closure Variables
	canvas: undefined,
	ctx: undefined,
	lastTime: 0, // calculating Delta Time
	animationID: 0,
	paused: false,
	debugging: true,
	score: 0,
	roundCount: 0,
	
//  Module loading
	entity: undefined,
	enemyCharacter: undefined,
	playerCharacter: undefined,
	sound: undefined,
	input: undefined,
	blaster: undefined,
	bullet: undefined,

//	Game data variables
	player: undefined,
	bullets: [],
	enemyNumber: 0,
	enemies: [],
 
	
	init: function(){
		console.log("game's init successfully called.");
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		this.player = new this.playerCharacter(this.WIDTH/2, this.HEIGHT-40, 30);
		
		this.enemies.push(new this.enemyCharacter(this.WIDTH/2,15));
		
		this.update();
	},
	
	update: function(){
		this.animationID = requestAnimationFrame(this.update.bind(this));
		
		if(this.paused){
			this.drawPauseScreen(this.ctx);
			return;
		}
		
		// setting dt
		var dt = this.calculateDeltaTime();
		
	// Updates

		// moves and checks for collisions
		this.moveBullets(dt);
		this.moveEntities(dt);
		
	// Draw Calls
		
		// background
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
		
		// Entities
		this.drawEntities(this.ctx);
		this.drawBullets(this.ctx);
		
		// HUD
		this.drawHUD(this.ctx, dt);
		
	},
	
	drawEntities: function(ctx){
		this.player.draw(ctx);
		
		/*
		for(var e=0; e<this.enemies.length; e++){
			this.enemies[e].draw();
		}
		*/
	},
	
	drawBullets: function(ctx){
		for(var b=0; b< this.bullets.length; b++){
			var bull = this.bullets[b];
			
			bull.draw(ctx);
		}
	},
	
	drawHUD: function(ctx, dt){
		ctx.save();
		//debugger;
		// Debugging
		if(this.debugging){
			ctx.strokeStyle = "white";
			ctx.font = "25pt Fascinate";
			ctx.lineWidth =2;
			ctx.strokeText("Dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 70);
		}
		
		// Score
		ctx.fillStyle = "white";
		ctx.font = "30px Fascinate";
		ctx.fillText("Score: " + this.score, 30, 50);
		
		// Draw a start screen?
		// Draw an end game screen
		
		ctx.restore();
	},
	
	pauseGame: function(){
		this.paused = true;
		
		cancelAnimationFrame(this.animationID);
		
		// will need to stop any sound
		this.update();
	},
	
	resumeGame: function(){
		this.paused = false;
		
		cancelAnimationFrame(this.animationID);
		
		// will need to restart any audio
		this.update();
	},
	
	// draws a pause screen
	drawPauseScreen: function(ctx){
		ctx.save();
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			ctx.fillStyle = "white";
			ctx.font = "40pt Fascinate";
			ctx.fillText("... PAUSED ...", this.WIDTH/2, this.HEIGHT/2);
		//	this.fillText(this.ctx,"... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
		ctx.restore();
	},
	
	moveBullets: function(dt){
		for(var i=0; i< this.bullets.length; i++){
			var bull = this.bullets[i];
			// Move
			bull.update(dt);
			
			// Check Edge
			if(bull.x < 0 || bull.y < 0 || bull.x > this.WIDTH || bull.y > this.HEIGHT){
				console.log("This has left the screen");
				console.log(bull);
				continue;
			}
			
			// Check Collisions
			for(var j=0; j < this.enemies.length; j++){
				if(bull.checkCollision(this.enemies[j])){
					score += 5;
				}
			}
		}
	},
	
	moveEntities: function(dt){
		this.player.update(dt, this.input);
		// future enemy movement
		/*
		for(var i = this.enemies.length-1; i >= 0; i++){
			var enemy = this.enemies[i];
			
			enemy.update(this.dt);
			
			if(enemy.checkEdges(this.WIDTH,this.HEIGHT)){
				this.enemies.splice(i,1);
			}			
			
		}
		*/
		
	},
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		//fps = clamp(fps, 12, 60);
		fps = Math.max(12,Math.min(60,fps));
		this.lastTime = now; 
		return 1/fps;
	},
	
	genEnemies: function(numEnemies){
		enemies.length = 0;
		
	}
	
}