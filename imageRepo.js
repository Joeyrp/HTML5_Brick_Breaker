
// Original code from https://html5gamedevelopment.com/2013-06-5-part-html5-game-tutorial-galaxian-shooter/

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function()
{
    this.callback = null;

    this.ballSpeedUp = new Image();
    this.ballSpeedDown = new Image();
    this.ballAlwaysBreak = new Image();
    this.paddleGrow = new Image();
    this.paddleSrink = new Image();
    this.ballCatch = new Image();

    this.imageArray = [this.ballSpeedUp, this.ballSpeedDown, this.paddleGrow, this.paddleSrink,
                        this.ballAlwaysBreak, this.ballCatch];

    var numImages = 6;
    var numLoaded = 0;

    this.allLoaded = false;

    function imageLoaded()
    {
        numLoaded++;
       // console.log(numLoaded + " images loaded\n");
        if (numLoaded === numImages)
        {
            this.allLoaded = true;
            window.initGame();
        }
    }

    this.ballSpeedUp.onload = function()
    {
        imageLoaded();
    }

    this.ballSpeedDown.onload = function()
    {
        imageLoaded();
    }

    this.ballAlwaysBreak.onload = function()
    {
        imageLoaded();
    }

    this.paddleGrow.onload = function()
    {
        imageLoaded();
    }

    this.paddleSrink.onload = function()
    {
        imageLoaded();
    }

    this.ballCatch.onload = function()
    {
        imageLoaded();
    }

    this.ballSpeedUp.src = "img/ballSpeedUp.png";
    this.ballSpeedDown.src = "img/ballSpeedDown.png";
    this.ballAlwaysBreak.src = "img/ballAlwaysBreak.png";
    this.paddleGrow.src = "img/paddleGrow.png";
    this.paddleSrink.src = "img/paddleSrink.png";
    this.ballCatch.src = "img/ballCatch.png";
}