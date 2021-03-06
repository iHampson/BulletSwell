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
	emitter: undefined,
	enemyCharacter: undefined,
	playerCharacter: undefined,
	sound: undefined,
	input: undefined,
	blaster: undefined,
	bullet: undefined,

//	Game data variables
	player: undefined,
	playerBullets: [],
	enemyBullets: [],
	enemyNumber: 0,
	enemies: [],
	gameState: undefined,
	GAME_STATE: Object.freeze({
		MENU: 0,
		PLAYING: 1,
		GAME_END: 2,
	}),
	currentLevel: 0,
	levels: [
		// Level 1
		{
			enemyCount: 1,
			blasterCount: 0,
		},
		// Level 2
		{
			enemyCount: 6,
			blasterCount: 0
		},
		// Level 3
		{
			enemyCount: 12,
			blasterCount: 0
		},
		// Level 4
		{
			enemyCount: 1,
			blasterCount: 1
		},
		// Level 5
		{
			enemyCount: 5,
			blasterCount: 2
		}
	],

	/*	Initializes the game variables
		  and launches the update loop */
	init: function(){
		window.addEventListener("keyup",this.checkDebug);
		document.querySelector("#startButton").onclick = function(){
			console.log("button pressed");
			app.game.gameState = 1;
			this.style.display = "none";
		};
		document.querySelector("#restartButton").onclick = function(){
			app.game.gameState = 1;
			this.style.display = "none";
		};
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');

		this.player = new this.playerCharacter(this.WIDTH/2, this.HEIGHT-40, 90);
		var pulsar = new this.emitter();
		pulsar.blue = 243;
		pulsar.red = 253;
		pulsar.green = 249;
		pulsar.minXspeed = pulsar.minYspeed = -0.25;
		pulsar.maxXspeed = pulsar.maxYspeed = 0.5;
		pulsar.lifetime = 100;
		pulsar.expansionRate = 0.2;
		pulsar.numParticles = 75;
		pulsar.xRange = pulsar.yRange = 10;
		pulsar.useCircles = true;
		pulsar.useSquares = false;
		pulsar.createParticles({
			x: app.game.player.x+10,
			y: app.game.player.y});
		this.player.splash = pulsar;

		this.nextLevel();
		console.log("game's init successfully called.");
		this.resumeGame();
	},

	// The game's loop, updates all objects and draws them to the screen
	update: function(){
		this.animationID = requestAnimationFrame(this.update.bind(this));
		// setting dt
		var dt = this.calculateDeltaTime();

		if(this.enemies.length == 0 && this.gameState === this.GAME_STATE.PLAYING){
			//debugger;
			//this.gameState = this.GAME_STATE.GAME_END;
			//this.drawHUD(this.ctx,dt);
			this.nextLevel();
		}

		// Menu State Logic
		if(this.gameState === this.GAME_STATE.MENU){
			document.querySelector("#startButton").style.display = "inline";
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
			if(this.moveBullets(dt)){
				this.moveEntities(dt);
				// Draw Calls

					// background
				this.ctx.fillStyle = "rgb(8, 72, 108)";
				this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

					// Entities
				this.drawEntities(this.ctx);
				this.drawBullets(this.ctx);

					// HUD
				this.drawHUD(this.ctx, dt);
			}
		} else
		// End Screen Logic
		if(this.gameState === this.GAME_STATE.GAME_END){
			document.querySelector("#restartButton").style.display = "inline";
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
		for(var b=0; b< this.playerBullets.length; b++){
			var bull = this.playerBullets[b];
			bull.draw(ctx);
		}
		for(var b=0; b< this.enemyBullets.length; b++){
			var bull = this.enemyBullets[b];
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
				// Title Text
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "#DB880C";
				ctx.font = "40pt Fascinate";
				ctx.fillText("Bullet Swell!",this.WIDTH/2,200);
				ctx.font = "25pt Fascinate";
				ctx.fillText("A basic bullet hell by: Ian Hampson",this.WIDTH/2,300);
				// Instruction Text
				ctx.font = "20pt Fascinate";
				ctx.fillStyle = "black";
				ctx.fillText("Instructions:",this.WIDTH/2,550);
				ctx.font = "16pt Fascinate";
				ctx.fillText("Move with the arrow keys and shoot with the space bar.",this.WIDTH/2,600);

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
				// debugger;
				// Draw an end game screen
				ctx.save();
				//	Setting up the gradient
				var grad = ctx.createLinearGradient(0,0,0,this.HEIGHT);
				grad.addColorStop(0,"#11547A");
				grad.addColorStop(1,"#222536");
				// Background
				ctx.fillStyle = grad;
				ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
				// Text
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = "#B90606";
				ctx.font = "40pt Fascinate";
				ctx.fillText("Game over!",this.WIDTH/2,200);
				ctx.font = "25pt Fascinate";
				ctx.fillText("Final Score: " + this.score,this.WIDTH/2,300);
				ctx.fillText("Final Round Count: " + this.roundCount,this.WIDTH/2,350);

				ctx.restore();
			break;
		}
		ctx.restore();
	},

	pauseGame: function(){
		this.paused = true;
		cancelAnimationFrame(this.animationID);
		this.sound.stopBGAudio();
		this.update();
	},

	resumeGame: function(){
		this.paused = false;
		cancelAnimationFrame(this.animationID);
		this.sound.playBGAudio();
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
		// Loops through the playerBullets array
		for(var i=0; i< this.playerBullets.length; i++){
			var pBull = this.playerBullets[i];
			var toDestroy = false;
			// Move
			pBull.update(dt);
			// debugger;
			// Check Edge
			if(pBull.x < 0 || pBull.y < 0 || pBull.x > this.WIDTH || pBull.y > this.HEIGHT){
				//console.log("This has left the screen");
				//console.log(bull);
				this.playerBullets.splice(i,1);
				continue;
			}

			// Check Collisions
			for(var j=0; j < this.enemies.length; j++){
				if(pBull.checkCollision(this.enemies[j])){
					console.log("Collison successfully");
					this.score += 5;
					toDestroy = true;
					this.enemies.splice(j,1);
				}
			}

			if(toDestroy)
				this.playerBullets.splice(i,1);

		}

		// Loops through the enemyBullets array
		for(var i=0; i< this.enemyBullets.length; i++){
			var eBull = this.enemyBullets[i];
			var toDestroy = false;
			// Move
			eBull.update(dt);
			// Check Edge
			if(eBull.x < 0 || eBull.y < 0 || eBull.x > this.WIDTH || eBull.y > this.HEIGHT){
				this.enemyBullets.splice(i,1);
				continue;
			}

			// Check Collisions
			debugger;
			if(eBull.checkCollision(this.player)){
					console.log("You've been shot!");
					this.enemies.length = 0;
					this.playerBullets.length = 0;
					this.enemyBullets.length = 0;
					this.gameState = this.GAME_STATE.GAME_END;
					this.currentLevel = -1;
					return false;
				}
		}
		return true;
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
			console.log("Player :");
			console.log(app.game.player);
		}
	},

	genEnemies: function(numEnemies,numBlasters){
		this.enemies.length = 0;
		for(var i = 0; i < numEnemies; i++){
			var x = getRandomInt(100,this.WIDTH-100);
			var y = getRandomInt(40, 200);
			var speed = getRandomInt(10,30);
			this.enemies.push(new this.enemyCharacter(x,y,speed));
		}
		// Arms some of the enemies
		for(var j=0; j<numBlasters; j++){
			this.enemies[j].arm();
		}

	},

	nextLevel: function(){
		switch(this.currentLevel){
			case 0:
				this.gameState = this.GAME_STATE.MENU;
			break;
			case 1:
				var thisLevel = this.levels[this.currentLevel-1];
				this.genEnemies(thisLevel.enemyCount,thisLevel.blasterCount);
				this.roundCount++;
			break;
			case 2:
				var thisLevel = this.levels[this.currentLevel-1];
				this.genEnemies(thisLevel.enemyCount,thisLevel.blasterCount);
				this.roundCount++;
			break;
			case 3:
				var thisLevel = this.levels[this.currentLevel-1];
				this.genEnemies(thisLevel.enemyCount,thisLevel.blasterCount);
				this.roundCount++;
			break;
			case 4:
				var thisLevel = this.levels[this.currentLevel -1];
				this.genEnemies(thisLevel.enemyCount,thisLevel.blasterCount);
				this.roundCount++;
			break;
			case 5:
				var thisLevel = this.levels[this.currentLevel -1];
				this.genEnemies(thisLevel.enemyCount,thisLevel.blasterCount);
				this.roundCount++;
			break;
			default:
				this.gameState = this.GAME_STATE.GAME_END;
				this.currentLevel = -1;
			break;
		}
		this.currentLevel++;
	}

}
