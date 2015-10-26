/*Sprites.js
  global helper class that will hold
  sprite animation logic and variables.

  sprite class modified lightly from example here:
  http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
*/

function sprite(options){
  var that = {};

  //that.ctx = options.ctx;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;
  that.rows = options.rows;
  that.cols = options.columns;

  that.render = function(ctx,xdest,ydest,col,row,scale){
    //that.ctx.drawImage(that.image,
    ctx.drawImage(that.image,
        // row index * frame width & column index * frame height
        col * that.width/that.cols, row * that.height/that.rows,
        that.width/this.cols, that.height/this.rows,
        xdest-(that.width/this.cols)/2, ydest-(that.height/this.rows)/2,
        (that.width/that.cols)*(scale/20), (that.height/that.rows)*(scale/20));
  }
  return that;

}
