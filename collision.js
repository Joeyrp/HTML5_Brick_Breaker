/******************************************************************************
*	File		-	collision.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/13 (y/m/d)
*	Mod Date	-	2018/09/14 (y/m/d)
*	Description	-	Represents the position, size and shape of an objects. 
*                   Also used to tell when objects are colliding. ONLY the
*                   BoxCollider exists/works at the moment.
*
******************************************************************************/

ColliderType = Object.freeze({BOX:0, CIRCLE: 1, INVALID:2});

function Collider()
{
    this.type = ColliderType.INVALID;   

    this.isColliding = function(c2) {};
}

function BoxCollider(x, y, width, height)
{
    this.type = ColliderType.BOX;
    this.x = x;
    this.y = y;
    this.with = width;
    this.height = height;

    this.isColliding = function(c2)
    {
        if (c2.type === ColliderType.BOX)
        {
            return this.checkAgainstBox(c2);
        }
        else if (c2.type === ColliderType.CIRCLE)
        {
            return this.checkAgainstCircle(c2);
        }
        else
        {
            console.log("ERROR: BoxCollider.isColliding -- c2 is an invalid Collider");
            return false;
        }
    }

    this.checkAgainstBox = function(c2)
    {
        // our left against their right
        if (this.x > c2.x + c2.width)
            return false;

        // their left against our right
        if (c2.x > this.x + this.width)
            return false;

        // our top against their bottom
        if (this.y > c2.y + c2.height)
            return false;

        // their top against our bottom
        if (c2.y > this.y + this.height)
            return false;

        return true;
    }

    this.checkAgainstCircle = function(c2)
    {
        // is the circle's center in the box?
        if (c2.x >= this.x && c2.x <= this.x + this.width &&
            c2.y >= this.y && c2.y <= this.y + this.height)
            return true;

        // TODO: Edge checks
        //  Need a vector from the circle's center perpendicular to the box's edge
        //  Check length of vector against radius of circle
        //  AND a point on the circle must be between the edge's end points
        //  Repeat for all box edges

        return false;
    }
}
BoxCollider.prototype = new Collider();



