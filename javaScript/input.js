/*	Input.js
	will contain and control the input code */

"use strict";

var app = app || {};

app.Input = function(){
	var Input = {};
	
	Input.KEYBOARD = Object.freeze({
		"KEY_LEFT": 37, 
		"KEY_UP": 38, 
		"KEY_RIGHT": 39, 
		"KEY_DOWN": 40,
		"KEY_SPACE": 32,
		"KEY_SHIFT": 16
	});
	
	// Input.keydown array to keep track of which keys are down
	// this is called a "key daemon"
	// main.js will "poll" this array every frame
	// this works because JS has "sparse arrays" - not every language does
	Input.keydown = [];
	
	// event listeners
	window.addEventListener("keydown",function(e){
	//	console.log("keydown=" + e.keyCode);
		Input.keydown[e.keyCode] = true;
	});
		
	window.addEventListener("keyup",function(e){
	//	console.log("keyup=" + e.keyCode);
		Input.keydown[e.keyCode] = false;
		
		// pausing and resuming
		var char = String.fromCharCode(e.keyCode);
		if (char === "p" || char === "P"){
			console.log(app.main.paused);
			if (app.main.paused){
				app.main.resumeGame();
			} else {
				app.main.pauseGame();
			}
		}
	});
	
	return Input;
	
}()