/******************************************************************************
*	File		-	paddle.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/14 (y/m/d)
*	Mod Date	-	2018/09/19 (y/m/d)
*	Description	-	The player controlled paddle. 
*
******************************************************************************/

// Requires gameObject.js, and userInput.js

function Paddle(ball)
{
    GameObject.call(this, "paddle");

    this.speed = 10;
    this.ball = ball;
    this.maxWidth = 250;
    this.minWidth = 50;
}

Paddle.prototype = Object.create(GameObject.prototype);
Paddle.prototype.constructor = Paddle;

Paddle.prototype.grow = function()
{
    if (this.collider.width + 25 < this.maxWidth)
        this.collider.width += 25;
}

Paddle.prototype.shrink = function()
{
    if (this.collider.width - 25 > this.minWidth)
        this.collider.width -= 25;
}

Paddle.prototype.update = function(deltaT)
{
    if (KEY_STATUS[KEY_LEFT] || KEY_STATUS["A".charCodeAt(0)])
    {
        this.collider.x -= this.speed;
        this.direction = "left";
        if (this.collider.x < 0)
            this.collider.x = 0;

        // push ball if colliding
        if (this.collider.isColliding(this.ball.collider))
        {
            this.ball.collider.x -= 10;
            if (this.ball.collider.x < 0)
            {
                this.ball.collider.x = 0;
                this.ball.collider.y = this.collider.y - (this.ball.collider.height + 1);
            }
        }
    }

   else if (KEY_STATUS[KEY_RIGHT] || KEY_STATUS["D".charCodeAt(0)])
    {
        this.collider.x += this.speed;
        this.direction = "right";
        if (this.collider.x + this.collider.width >= 800)
            this.collider.x = (800 - this.collider.width) - 1;

        // push ball if colliding
        if (this.collider.isColliding(this.ball.collider))
        {
            this.ball.collider.x += 10;
            if (this.ball.collider.x + this.ball.collider.width > 800)
            {
                this.ball.collider.x = 800;
                this.ball.collider.y = this.collider.y - (this.ball.collider.height + 1);
            }
        }
    }
    else
    {
        this.direction = "stop";
    }
}

Paddle.prototype.draw = function(gc)
{
    gc.fillStyle = "white";
    gc.fillRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
}