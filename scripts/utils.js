/******************************************************************************
*	File		-	utils.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/14 (y/m/d)
*	Mod Date	-	2018/09/17 (y/m/d)
*	Description	-	Contains some useful, general functions.
*
******************************************************************************/

function RandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RadToDegrees(rad)
{
    return (rad * 180) / Math.PI;
}

// Reflect (x,y) by normal vector (nx, ny)
// −(2(n · v) n − v)
// v - 2 * (v*n) * n
// Where v = (x1, y1) and n = (nx, ny)
function VectorReflect(x1, y1, nx, ny)
{
    var dot = VectorDot(x1, y1, nx, ny);
    var nx2 = dot * nx;
    var ny2 = dot * ny;
    var rx = 2 * nx2;
    var ry = 2 * ny2;
    rx = x1 - rx;
    ry = y1 = ry;

    return { x:rx, y:ry };
}

function VectorDot(x1, y1, x2, y2)
{
    var rx = x1 * x2;
    var ry = y1 * y2;
    var result = rx + ry;
    return result;
}