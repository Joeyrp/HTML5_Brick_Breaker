/******************************************************************************
*	File		-	gameObject.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/14 (y/m/d)
*	Mod Date	-	2018/09/19 (y/m/d)
*	Description	-	A base "class" for all game objects. All game objects
*                   have a BoxCollider that represents its position and size.
*
******************************************************************************/

// base class for all game objects
function GameObject(type)
{
    this.collider = new BoxCollider(0, 0, 0, 0);
    this.type = type;
    //console.log("the collider type is: " + this.collider.type);

}

GameObject.prototype.setPos = function(x, y)
{
    this.collider.x = x;
    this.collider.y = y;
}

GameObject.prototype.setSize = function(width, height)
{
    this.collider.width = width;
    this.collider.height = height;
}

GameObject.prototype.update = function(deltaT) {};
GameObject.prototype.draw = function(context) {};