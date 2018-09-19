/******************************************************************************
*	File		-	gameTimer.js
*	Author		-	Joey Pollack
*	Date		-	2018/09/17 (y/m/d)
*	Mod Date	-	2018/09/17 (y/m/d)
*	Description	-	A timer that runs in milliseconds. Also keeps track
*                   of frames per second if the update() function is called
*                   once each frame.

******************************************************************************/

function GameTimer()
{
    var startTime = 0;
    var prevTime = 0;
    var lastSecond = 0
    var currentNumFrames = 0;

    this.totalElapsedTime = 0;
    this.framesPerSecond = 0;

    this.start = function()
    {
        startTime = new Date();
    }

    this.update = function()
    {
        var curTime = new Date();
        var deltaT = curTime - prevTime;
        prevTime = curTime;
        this.totalElapsedTime = curTime - startTime;   
        lastSecond += deltaT;
        currentNumFrames++;
        
        if (lastSecond >= 1000)
        {
            this.framesPerSecond = currentNumFrames;
            lastSecond = 0;
            currentNumFrames = 0;
        }

        return deltaT;
    }

}
