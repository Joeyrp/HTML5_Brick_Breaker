/******************************************************************************
*	File		-	vector.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/14 (y/m/d)
*	Mod Date	-	2018/09/14 (y/m/d)
*	Description	-	Represents a 2D vector and can perform some basic vector
*                   operations.
*
******************************************************************************/

function vec2D(x, y)
{
    this.x = x;
    this.y = y;

    this.length = function()
    {
        var x2 = this.x * this.x;
        var y2 = this.y * this.y;

        return Math.sqrt(x2 + y2);
    }

    this.add = function(v2)
    {
        var result = new vec2D(this.x + v2.x, this.y + v2.y);
        return result;
    }

    this.subtract = function(v2)
    {
        var result = new vec2D(this.x - v2.x, this.y - v2.y);
        return result;
    }

    this.scaleBy = function(sv)
    {
        this.x *= sv;
        this.y *= sv;
    }

    this.squaredLength = function()
    {
        var x2 = x * x;
        var y2 = y * y;

        return x2 + y2;
    }

    this.normalize = function()
    {
        var len = this.length();
        this.x = this.x / len;
        this.y = this.y / len;
    }

    this.dotWith = function(v2)
    {
        rx = this.x * v2.x;
        ry = this.y * v2.y;
        return rx + ry;
    }

    this.angleBetween = function(v2)
    {
        var v1 = new vec2D(this.x, this.y);
        v1.normalize();
        var nv2 = new vec2D(v2.x, v2.y);
        nv2.normalize();

        var dp = v1.dotWith(nv2);
        var ac = Math.acos(dp);
        return ac;
    }
}