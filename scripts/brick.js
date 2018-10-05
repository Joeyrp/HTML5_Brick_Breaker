/******************************************************************************
*	File		-	brick.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/17 (y/m/d)
*	Mod Date	-	2018/09/19 (y/m/d)
*	Description	-	The brick objects.
*
******************************************************************************/

// Requires gameObject.js

function Brick()
{
    GameObject.call(this, "brick");

    // How many hits before the brick is destroyed
    this.life = 2;
}
Brick.prototype = Object.create(GameObject.prototype);
Brick.prototype.constructor = Brick;

Brick.prototype.update = function(deltaT)
{
    
}

Brick.prototype.draw = function(gc)
{
    
    if (this.life == 2)
        gc.fillStyle = "white";
    else if (this.life == 1)
        gc.fillStyle = "red";

    gc.fillRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
    gc.strokeRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
}