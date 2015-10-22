/*  Util.js
    will serve as a global file to house static methods
    needed throughout the program itself.               */
"use strict";

/*  Function Name: clamp(val, min, max)
    Author: Web - various sources - Borrowed from Boomshine
    Return Value: the constrained value
    Description: returns a value that is
    constrained between min and max (inclusive)  */
function clamp(val, min, max){
    return Math.max(min, Math.min(max,val));
}
