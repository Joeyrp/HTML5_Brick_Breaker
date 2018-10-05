/******************************************************************************
*	File		-	ball.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/14 (y/m/d)
*	Mod Date	-	2018/09/19 (y/m/d)
*	Description	-	The game ball. Ball collision response is handled here.
*
******************************************************************************/

// Requires gameObject.js, vector.js and utils.js

function Ball()
{
    GameObject.call(this, "ball");

    this.velocity = new vec2D(0, 0);
    this.speed = 9;
    this.maxSpeed = 20;
    this.minSpeed = 5;
    
    // NOTE: These values should be passed into the class
    this.screenWidth = 800;
    this.screenHeight = 600;

    this.isCaught = true;
    this.hitGround = false;
    this.alwaysBreak = false;
    this.alwaysCatch = false;

    this.curAngle = 0;
    this.maxAngle = 70;
    this.minAngle = 20;
}

Ball.prototype = Object.create(GameObject.prototype);
Ball.prototype.constructor = Ball;

// Randomly adjust the velocity. This will make the ball's bouncing patterns 
// less predictable.
Ball.prototype.adjustVel = function()
{
    var adjustX = RandomInt(0, 4) - 2; // value between -2 and 2
    var adjustY = RandomInt(0, 4) - 2;

    var newX = this.velocity.x;
    var newY = this.velocity.y;
    
    // Make sure the adjustment does NOT cause the velocity to 
    //  flip from positive to negative (or backwards)
    if ((newX > 0 && newX + adjustX > 0) ||
        (newX < 0 && newX + adjustX < 0))
        newX += adjustX;
    
    if ((newY > 0 && newY + adjustY > 0) ||
        (newY < 0 && newY + adjustY < 0))
        newY += adjustY;

    // The angle between the ball's velocity and the world up vector must
    // stay in a resonable range so the ball doesn't bounce mostly vertically
    // or mostly horizontally.
    // The absolute value of the y component is used because we don't care whether
    // the ball is moving up.
    var newVel = new vec2D(newX, Math.abs(newY));
    var newAngle = newVel.angleBetween(new vec2D(0, 1));
    newAngle = RadToDegrees(newAngle);

    if (newAngle < this.maxAngle && newAngle > this.minAngle)
        this.setDirection(newX, newY);
}

// This will change the direction of the ball's velocity without
// changing it's speed
Ball.prototype.setDirection = function(x, y)
{
    this.velocity.x = x;
    this.velocity.y = y;
    this.velocity.normalize();
    this.velocity.scaleBy(this.speed);
}

// Change the speed of the velocity without changing the direction
Ball.prototype.setSpeed = function(sp)
{
    this.speed = sp;
    this.velocity.normalize();
    this.velocity.scaleBy(sp);
}

Ball.prototype.speedUp = function()
{
    if (this.speed + 2 > this.maxSpeed)
        return;

    this.setSpeed(this.speed + 2);
}

Ball.prototype.speedDown = function()
{
    if (this.speed - 2 < this.minSpeed)
        return;

    this.setSpeed(this.speed - 2);
}

// UPDATE METHOD
// ---------------------------------------------
Ball.prototype.update = function(deltaT)
{
    var doAdjust = false;

    // Step in the X direction
    this.collider.x += this.velocity.x;

    // Screen bounds check
    if (this.collider.x < 0)
    {
        this.collider.x = 0;
        this.velocity.x = -this.velocity.x;

        doAdjust = true;

    }
    else if (this.collider.x + this.collider.width >= this.screenWidth)
    {
        this.collider.x = this.screenWidth - this.collider.width - 1;
        this.velocity.x = -this.velocity.x;

        doAdjust = true;
    }

    // Step in the Y direction
    this.collider.y += this.velocity.y;

    // Screen bounds check
    if (this.collider.y < 0)
    {
        this.collider.y = 0;
        this.velocity.y = -this.velocity.y;

        doAdjust = true;
    }
    else if (this.collider.y + this.collider.height >= this.screenHeight)
    {
        this.collider.y = this.screenHeight - this.collider.height - 1;
        this.velocity.y = -this.velocity.y;

        doAdjust = true;
        this.hitGround = true;
    }

    if (doAdjust)
        this.adjustVel();

    var tempVel = new vec2D(this.velocity.x, Math.abs(this.velocity.y));
    this.curAngle = RadToDegrees(tempVel.angleBetween(new vec2D(0, 1)));
}


// COLLISION EVENT
// ---------------------------------------------
Ball.prototype.collidingWith = function(obj)
{
    // Resolve collision
    // unstep on X and recheck collision
    this.collider.x -= this.velocity.x;

    if (!this.collider.isColliding(obj.collider))
    {
        this.velocity.x = -this.velocity.x;
        if (obj.type != "paddle")
        {
            this.adjustVel();
        }
        return;
    }
    this.collider.x += this.velocity.x;

    // unstep on Y and recheck collision
    this.collider.y -= this.velocity.y;

    if (!this.collider.isColliding(obj.collider))
    {
        this.velocity.y = -this.velocity.y;
        if (obj.type != "paddle")
        {
            this.adjustVel();
        }
        return;
    }

    // Unstep Both
    this.collider.x -= this.velocity.x;
    if (!this.collider.isColliding(obj))
    {
        this.velocity.y = -this.velocity.y;
        this.velocity.x = -this.velocity.x;
        if (obj.type != "paddle")
        {
            this.adjustVel();
        }
    }

    
}

// DRAW METHOD
// ---------------------------------------------
Ball.prototype.draw = function(context)
{
    context.fillStyle = "white";
    context.beginPath();
    var centerX = this.collider.x + (this.collider.width / 2);
    var centerY = this.collider.y + (this.collider.height / 2);
    context.arc(centerX, centerY, this.collider.width / 2, 0, 2*Math.PI);
    context.fill();
    context.stroke();
}