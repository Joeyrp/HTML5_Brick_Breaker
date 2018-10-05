/******************************************************************************
*	File		-	main.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/12 (y/m/d)
*	Mod Date	-	2018/10/05 (y/m/d)
*	Description	-	The main file for the game. Contains the main loop and 
*                   handles game objects and general game logic.
*
******************************************************************************/

// Requires all other .js files...

var game = new Game();
function initGame()
{
    if (!imageRepository.allLoaded)
    {
        console.log("MAIN: Images NOT loaded \n");
        setTimeout(initGame, 500);
    }
    else
    {
        game.init();
        console.log("MAIN: Images loaded!!");
        GameLoop(0);
    }
}


function Game()
{
    this.mainCanvas = null;
    this.mainContext = null;

    this.timer = null;
    this.levelDispTimer = null;

    this.playerScore = 0;
    this.playerLives = 3;
    this.level = 0;
    this.gameOver = false;
    this.pause = false;

    // Game Objects
    this.ball = null;
    this.paddle = null;
    this.bricks = [];
    this.numBricks = 32;
    this.powerUps = [];
    this.maxPowerUps = 3;

    this.init = function()
    {
        this.playerScore = 0;
        this.gameOver = false;
        this.pause = false;

        this.mainCanvas = document.getElementById("canvas_main");
        this.mainContext = this.mainCanvas.getContext("2d");

        this.ball = new Ball();
        this.ball.setPos(375, 524);
        this.ball.setSize(25, 25);
        this.ball.setDirection(7, 6);
        this.ball.setSpeed(10);
        this.ball.adjustVel();
        this.ball.alwaysBreak = false;
        this.ball.alwaysCatch = false;

        this.paddle = new Paddle(this.ball);
        this.paddle.setPos(325, 550);
        this.paddle.setSize(150, 15);
        
        this.catchBall(true);

        this.spawnBricks();

        this.powerUps = [];

       // this.levelDispTimer = new GameTimer();
        this.timer = new GameTimer();
        this.timer.start();
    }

    this.spawnBricks = function()
    {
        var yPos = 50;
        for (var i = 0; i < 4; i++)
        {
            for (var j = 0; j < 8; j++)
            {
                var brick = new Brick();
                brick.setPos(100 * j, yPos);
                brick.setSize(100, 30);
                brick.life = 2;
                this.bricks[i * 8 + j] = brick;
            }

            yPos += 30;
        }

        document.getElementById("level").innerHTML = "Level: " + this.level;
        document.getElementById("level").style.display = "block";
       // this.levelDispTimer.start();
    }

    this.spawnPowerUp = function(x, y)
    {
        var selectedType = "NONE";
        var found = false;
        var pt = RandomInt(0, 50);

        if (pt < 10)
        {
            selectedType = "ballSpeedUp"
            pt = 0;
        }
        else if (pt < 20)
        {
            selectedType = "ballSpeedDown";
            pt = 1;
        }
        else if (pt < 30)
        {
            selectedType = "paddleGrow";
            pt = 2;
        }
        else if (pt < 40)
        {
            selectedType = "paddleShrink";
            pt = 3;
        }
        else if (pt < 42)
        {
            selectedType = "ballAlwaysBreak";
            pt = 4;
        }
        else 
        {
            selectedType = "ballCatch";
            pt = 5;
        }

        for (i = 0; i < this.maxPowerUps; i++)
        {
            if (this.powerUps[i] == undefined || (this.powerUps[i] != undefined && this.powerUps[i].alive === false))
            {
                found = true;
                this.powerUps[i] = new PowerUp(selectedType, imageRepository.imageArray[pt]);
                this.powerUps[i].collider.x = x;
                this.powerUps[i].collider.y = y;
                this.powerUps[i].collider.width = imageRepository.imageArray[pt].width;
                this.powerUps[i].collider.height = imageRepository.imageArray[pt].height;
                
                break;
            }
        }
    }

    this.restart = function()
    {
        document.getElementById("game-over").style.display = "none";
        this.gameOver = false;
        this.init();
    }
    
    this.executePowerUp = function(type)
    {
        if (type === "ballSpeedUp")
        {
            this.ball.speedUp();
        }
        else if (type === "ballSpeedDown")
        {
            this.ball.speedDown();
        }
        else if (type === "ballAlwaysBreak")
        {
            this.ball.alwaysBreak = true;
        }
        else if (type === "paddleGrow")
        {
            this.paddle.grow();
        }
        else if (type === "paddleShrink")
        {
            this.paddle.shrink();
        }
        else if (type === "ballCatch")
        {
            this.ball.alwaysCatch = true;
        }
    }

    this.catchBall = function(center)
    {
        this.ball.isCaught = true;

        // attach the ball to the center of the paddle
        if (center === true)
        {
            this.ball.collider.x = this.paddle.collider.x + this.paddle.collider.width / 2
            this.ball.collider.x -= this.ball.collider.width / 2;
    
            this.ball.collider.y = this.paddle.collider.y - (this.ball.collider.height + 1);
        }
    }

    // newTime is a timestamp in milliseconds
    this.update = function(newTime)
    {  
        // frame timer handling
        // --------------------------------------
        var deltaT = this.timer.update();
        
        // Debug Output
        // --------------------------------------    
        if (document.getElementById("debug-check").checked)
        {
            var debugElm = document.getElementById("debug");
            debugElm.innerHTML = "FPS: " + Math.trunc(this.timer.framesPerSecond) + 
                                ", Ball Velocity: (" + parseFloat(this.ball.velocity.x).toFixed(2) +
                                ", " + parseFloat(this.ball.velocity.y).toFixed(2) + ")" + 
                                ", Ball Angle: " + parseFloat(this.ball.curAngle).toFixed(2) +
                                ", Ball Speed: " + this.ball.speed;
        }    
        else
        {
            document.getElementById("debug").innerHTML = "";
        }
        
        
        // Game state stuff
        // -------------------------------------- 
        if (this.gameOver || this.pause)
        {
            return;
        }

        if (CheckKeyState(KEY_ENTER))
        {
            this.pause = !this.pause;
        }

        // Update Game Objects
        // --------------------------------------
        this.updateGameObjects(deltaT);

        // Collision checks
        // --------------------------------------
        this.doCollisionChecks();
        
    }


    this.updateGameObjects = function(deltaT)
    {
        if (this.ball.isCaught)
        {
            deltaX = this.paddle.collider.x;
            this.paddle.update();
            deltaX = deltaX - this.paddle.collider.x;
            this.ball.collider.x -= deltaX;
        }
        else
        {
            this.paddle.update(deltaT);
            this.ball.update(deltaT);
        }

        if (this.ball.hitGround)
        {
            if (this.playerLives > 0)
            {
                this.playerLives -= 1;
                this.catchBall(true);
                this.ball.hitGround = false;
            }
            else
            {
                this.gameOver = true;
                document.getElementById("game-over").style.display = "block";
            }
        }

        if (this.ball.isCaught)
        {
           this.catchBall(false);

            // detach when space is pressed
            if (KEY_STATUS[KEY_SPACE])
            {
                this.ball.isCaught = false;
                document.getElementById("level").style.display = "none";
            }
        }

        var numBricksLeft = 0;
        for (var i = 0; i < this.numBricks; i++)
        {
            if (this.bricks[i].life > 0)
            {
                this.bricks[i].update(deltaT);
                numBricksLeft++;
            }
        }

        // Move to next level when all bricks are destroyed
        if (0 == numBricksLeft)
        {
            this.playerScore += Math.trunc(1000 * Math.pow(this.level, 1.5) + 1000);
            this.level++;

            // Cancel some powerups
            this.ball.alwaysBreak = false;
            this.ball.alwaysCatch = false;
            this.powerUps = [];

            // Spawn more bricks
            this.catchBall(true);
            this.spawnBricks();

            this.ball.alwaysCatch = false;
            this.ball.alwaysBreak = false;
            
            this.powerUps = [];
        }

        // powerups
        for (var i = 0; i < this.maxPowerUps; i++)
        {
            if (this.powerUps[i] && this.powerUps[i].alive)
            {
                this.powerUps[i].update(deltaT);

                if (this.powerUps[i].collider.y > 600)
                    this.powerUps[i].alive = false;
            }
        }
    }


    this.doCollisionChecks = function()
    {
        // Ball vs Paddle
        if (this.ball.collider.isColliding(this.paddle.collider))
        {
            this.ball.collidingWith(this.paddle);

            if (this.ball.alwaysCatch)
                this.ball.isCaught = true;
        }

        // Ball vs Bricks
        for (var i = 0; i < this.numBricks; i++)
        {
            if (this.bricks[i].life > 0)
            {
                if (this.ball.collider.isColliding(this.bricks[i].collider))
                {
                    if (this.ball.alwaysBreak)
                    {
                        this.bricks[i].life = 0;
                    }
                    else
                    {
                        this.bricks[i].life--;
                        this.ball.collidingWith(this.bricks[i]);
                    }

                    if (this.bricks[i].life < 1)
                    {
                        this.playerScore += 10;

                        // chance to spawn power up:
                        var chance = RandomInt(0, 100);
                        console.log("chance: " + chance);
                        if (chance > 40)
                        {
                            this.spawnPowerUp(this.ball.collider.x, this.ball.collider.y);
                        }
                    }
                }
            }
        }

        // Paddle vs Powerups
        for (var i = 0; i < this.maxPowerUps; i++)
        {
            if (this.powerUps[i] && this.powerUps[i].alive)
            {
                if (this.paddle.collider.isColliding(this.powerUps[i].collider))
                {
                    this.powerUps[i].alive = false;

                    this.executePowerUp(this.powerUps[i].type);
                    console.log("puScore: " + this.powerUps[i].score);
                    this.playerScore += this.powerUps[i].score;
                }
            }
        }
    }

    this.renderObjects = function()
    {
        this.ball.draw(this.mainContext);
        this.paddle.draw(this.mainContext);

        for (var i = 0; i < this.numBricks; i++)
        {
            if (this.bricks[i].life > 0)
            {
                this.bricks[i].draw(this.mainContext);
            }
        }

        for (var i = 0; i < this.maxPowerUps; i++)
        {
            if (this.powerUps[i] && this.powerUps[i].alive)
            {
                this.powerUps[i].draw(this.mainContext);
            }
        }
    }
}



function DrawBackground(context)
{
    context.fillStyle = "rgb(10, 10, 50)";
    context.fillRect(0, 0, game.mainCanvas.width, game.mainCanvas.height);
}

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function GameLoop(newTime)
{
    // clear canvas
    game.mainContext.clearRect(0, 0, game.mainCanvas.width, game.mainCanvas.height);

    DrawBackground(game.mainContext);
    game.update(newTime);
    
    game.renderObjects();

    // UI
    document.getElementById("score").innerHTML = game.playerScore;
    document.getElementById("lives").innerHTML = game.playerLives;
    
    //request callback at next frame
    requestAnimFrame(GameLoop);
}

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function() 
{
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function(callback, element)
    {
        window.setTimeout(callback, 1000/60);
    }
})();


