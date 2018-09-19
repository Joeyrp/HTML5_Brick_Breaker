/******************************************************************************
*	File		-	powerUp.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/19 (y/m/d)
*	Mod Date	-	2018/09/19 (y/m/d)
*	Description	-	The power up game object. 
*
******************************************************************************/


// requires gameObject.js

function PowerUp(type, image)
{
    GameObject.call(this, "powerUp");

    this.type = type;
    this.image = image;
    this.alive = true;

    // NOTE: These values should be passed into the class
    this.screenWidth = 800;
    this.screenHeight = 600;

    var scores = {"ballSpeedDown":20, "ballSpeedUp":40, "paddleGrow":20, "paddleShrink":50, 
                    "ballAlwaysBreak":20, "ballCatch":20};
    this.score = scores[this.type];

    var randX = RandomInt(0, 8) - 4;
    var randY = RandomInt(0, 2) + 2;
    this.velocity = new vec2D(randX, randY);
}

PowerUp.prototype = Object.create(GameObject.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.update = function(deltaT)
{
    this.collider.x += this.velocity.x;
    this.collider.y += this.velocity.y;

    // Screen bounds check
    if (this.collider.x < 0)
    {
        this.collider.x = 0;
        this.velocity.x = -this.velocity.x;
    } 
    else if (this.collider.x + this.collider.width >= this.screenWidth)
    {
        this.collider.x = this.screenWidth - this.collider.width - 1;
        this.velocity.x = -this.velocity.x;
    }
}

PowerUp.prototype.draw = function(gc)
{
    gc.drawImage(this.image, this.collider.x, this.collider.y);
}