/*  
	Base loader class(file) that will load in other module files and tie them together
    will need to "include" new modules here first to properly tie the files together.
*/

"use strict";

var app = app || {};

window.onload = function(){
	console.log("window has loaded");

/*
*/
	app.game.entity = app.Entity;
	app.game.enemyCharacter = app.Enemy;
	app.game.playerCharacter = app.Player;
	app.game.blaster = app.Blaster;
	app.game.bullet = app.Bullet;
//	app.game.sound = app.sound;
	app.game.input = app.Input;

	app.game.init();
}

window.onblur = function(){
	console.log("Blur at " + Date());
	app.game.pauseGame();
}

window.onfocus = function(){
	console.log("Focus at " + Date());
	app.game.resumeGame();
}
