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
	debugging: false,
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
	gameState: undefined,
	GAME_STATE: Object.freeze({
		MENU: 0,
		PLAYING: 1,
		GAME_END: 2,
	}),

	/*	Initializes the game variables
		  and launches the update loop */
	init: function(){
		window.addEventListener("keyup",this.checkDebug);
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		this.player = new this.playerCharacter(this.WIDTH/2, this.HEIGHT-40, 90);

		this.enemies.push(new this.enemyCharacter(this.WIDTH/2,15, 10));

		this.gameState = 0; // Controls which state the program starts in

		console.log("game's init successfully called.");
		this.update();
	},

	// The game's loop, updates all objects and draws them to the screen
	update: function(){
		this.animationID = requestAnimationFrame(this.update.bind(this));
		// setting dt
		var dt = this.calculateDeltaTime();

		// Menu State Logic
		if(this.gameState === this.GAME_STATE.MENU){
			this.drawHUD(this.ctx);
		} else
		// Game Loop Logic
		if(this.gameState === this.GAME_STATE.PLAYING){
			if(this.paused){
				this.drawPauseScreen(this.ctx);
				return;
			}


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
		} else
		// End Screen Logic
		if(this.gameState === this.GAME_STATE.GAME_END){
			this.drawHUD(this.ctx,dt);
		}

	},

	drawEntities: function(ctx){
		this.player.draw(ctx);

		for(var e=0; e<this.enemies.length; e++){
			this.enemies[e].draw(ctx);
		}

	},

	drawBullets: function(ctx){
		for(var b=0; b< this.bullets.length; b++){
			var bull = this.bullets[b];
			bull.draw(ctx);
		}
	},

	drawHUD: function(ctx, dt){
		ctx.save();
		switch(this.gameState){
			case this.GAME_STATE.MENU:
			// Draw a start screen?
			ctx.save();

				//	Setting up the gradient
				var grad = ctx.createLinearGradient(0,0,0,this.HEIGHT);
				grad.addColorStop(0,"#2299DD");
				grad.addColorStop(1,"#0F24AC");
				// Background
				ctx.fillStyle = grad;
				ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
				// Text
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "#DB880C";
				ctx.font = "40pt Fascinate";
				ctx.fillText("Bullet Swell!",this.WIDTH/2,200);
				ctx.font = "25pt Fascinate";
				ctx.fillText("A basic bullet hell by: Ian Hampson",this.WIDTH/2,300);

				//debugger; NEED TO FIX HOW BUTTONS ARE HANDELED AND DRAWN
				document.getElementById("startButton").style.top = 350;
				document.getElementById("startButton").style.left = this.WIDTH/2;
				document.getElementById("startButton").style.display = "block";

			ctx.restore();
			break;
			case this.GAME_STATE.PLAYING:
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
			break;
			case this.GAME_STATE.GAME_END:
			// Draw an end game screen
			break;
		}
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
			var grad = ctx.createRadialGradient(this.WIDTH/2,this.HEIGHT/2,10,
																					this.WIDTH/2,this.HEIGHT/2,800);
			grad.addColorStop(0,"#D9D9D9");
			grad.addColorStop(1,"#000000");

			ctx.fillStyle = grad;
			ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			ctx.fillStyle = "black";
			ctx.font = "40pt Fascinate";
			ctx.fillText("... PAUSED ...", this.WIDTH/2, this.HEIGHT/2);
  	//this.fillText(this.ctx,"... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
		ctx.restore();
	},

	moveBullets: function(dt){
		for(var i=0; i< this.bullets.length; i++){
			var bull = this.bullets[i];
			var toDestroy = false;
			// Move
			bull.update(dt);
			// debugger;
			// Check Edge
			if(bull.x < 0 || bull.y < 0 || bull.x > this.WIDTH || bull.y > this.HEIGHT){
				//console.log("This has left the screen");
				//console.log(bull);
				this.bullets.splice(i,1);
				continue;
			}

			// Check Collisions
			for(var j=0; j < this.enemies.length; j++){
				if(bull.checkCollision(this.enemies[j])){
					console.log("Collison successfully");
					this.score += 5;
					toDestroy = true;
					//this.enemies.splice(j,1);
				}
			}

			if(toDestroy)
				this.bullets.splice(i,1);

		}
	},

	moveEntities: function(dt){
		this.player.update(dt, this.input);
		// future enemy movement


		for(var i = this.enemies.length-1; i >= 0; i--){
			var enemy = this.enemies[i];
			//debugger;
			enemy.update(dt);
			/*
			if(enemy.checkEdges(this.WIDTH,this.HEIGHT)){
				this.enemies.splice(i,1);
			}*/

		}


	},

	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date);
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		fps = Math.max(12,Math.min(60,fps));
		this.lastTime = now;
		return 1/fps;
	},

	checkDebug: function(e){
		var char = String.fromCharCode(e.keyCode);
		if (char === "p" || char === "P"){ // pausing and resuming
		//	console.log(app.game.paused);
			if (app.game.paused){
				app.game.resumeGame();
			} else {
				app.game.pauseGame();
			}
		}else if (char === "d" || char === "D"){ // toggle the debugger
			if(app.game.debugging){
				app.game.debugging = false;
			}else {
				app.game.debugging = true;
			}
		}else if (char === "a" || char === "A") { // the bullet array
			console.log(app.game.bullets);
		}
	},

	genEnemies: function(numEnemies){
		enemies.length = 0;

	}

}
