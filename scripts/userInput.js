/******************************************************************************
*	File		    -	  userInput.js
*	Author		  -	  Joey Pollack
*	Date		    -	  2018/09/14 (y/m/d)
*	Mod Date	  -	  2018/09/16 (y/m/d)
*	Description	-	  Handles keyboard input. Could be expanded to handle mouse
*                 input as well. More KEY_CODES should be added to avoid
*                 forcing the user to do "A".charCodeAt(0) in order to get
*                 alpha-numeric input.
*
*                 Usage: the value at KEY_STATUS[KEY_CODE] will be true when
*                 the user is holding the key down. For non-repeating input use
*                 CheckKeyState which will return true the first time it is called
*                 but return false afterwards until the user releases and presses
*                 the key again.
*
******************************************************************************/

KEY_CHECKED = []
KEY_STATUS = [];
for (var i = 0; i < 256; i++)
{
  KEY_STATUS[i] = false;
  KEY_CHECKED[i] = false;
}

document.onkeydown = function(e)
{
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  KEY_STATUS[keyCode] = true;
  
  e.preventDefault();
}

document.onkeyup = function(e)
{
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  KEY_STATUS[keyCode] = false;
  KEY_CHECKED[keyCode] = false;
  
  e.preventDefault();
}

function CheckKeyState(keyCode)
{
  if (KEY_STATUS[keyCode] && !KEY_CHECKED[keyCode])
  {
    KEY_CHECKED[keyCode] = true;
    return true;
  }

  return false;
}

KEY_UP = 38;
KEY_DOWN = 40;
KEY_LEFT = 37;
KEY_RIGHT = 39;
KEY_SPACE = 32;
KEY_ENTER = 13;