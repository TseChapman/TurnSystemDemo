/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, Settings: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Constructor
function AddRemovePlayerDemo() {
    /*
     * DESIGN:
     * 
     * Demo Parameters:
     *  - Font
     *  - Max player number
     *  - Turn type
     * 
     * Demo Components:
     *  - Camera
     *  - Turn system
     *  - Status (Number of Player, recent action(Add/Remove))
     *  - Recent action string
     *  - current index for new player
     *  
     * Demo Inputs:
     *  - up key to add a player
     *  - down key to remove a player
     */
    // Demo Parameters:
    this.kFont = 'assets/fonts/Consolas-24';
    this.mMaxPlayerNum = 10;
    this.mTurnType = 'timed';
    
    // Demo Components:
    this.mCamera = null;
    this.mTurnSystem = null;
    this.mLastPlayer = null;
    this.mStatus = null;
    this.mRecentAction = "None";
    
    // Count for new player
    this.mCurPlayerIndex = 0;
}

// Begin Scene: must load all the scene contents
// when done 
//  => start the GameLoop
// The game loop will call initialize and then update/draw
AddRemovePlayerDemo.prototype.loadScene = function () {
    // override to load scene specific contents
    gEngine.Fonts.loadFont(this.kFont);
};

// Performs all initialization functions
//   => Should call gEngine.GameLoop.start(this)!
AddRemovePlayerDemo.prototype.initialize = function () {
    // initialize the level (called from GameLoop)
    // Initialize the Camera
    this._initCamera();
    
    // Initialize TurnSystem
    this._initTurnSystem();
    
    // Setup the LastPlayer font renderable
    this._setupLastPlayer();
    
    // Setup the Status font renderable
    this._setupStatus();
};

// update function to be called form EngineCore.GameLoop
AddRemovePlayerDemo.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
    
    // Check user inputs
    this._userInputs();
    
    // Update last Player
    this._updateLastPlayer();
    
    // Update Status
    this._updateStatus();
};

// draw function to be called from EngineCore.GameLoop
AddRemovePlayerDemo.prototype.draw = function () {
    // Set Canvas background to light gray
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    // Set the Camera projection
    this.mCamera.setupViewProjection();
    
    // Draw Components
    this._drawComponents(this.mCamera);
};

// Must unload all resources
AddRemovePlayerDemo.prototype.unloadScene = function () {
    // .. unload all resources
    gEngine.Fonts.unloadFont(this.kFont);
};

// Called from initialize. Initialize the mCamera
AddRemovePlayerDemo.prototype._initCamera = function () {
    // Set up the cameras
    this.mCamera = new Camera(
      vec2.fromValues(100, 75), // position of the camera
      200, // width of camera
      [0, 0, 800, 600] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray
};

// Called from initialize. Initialize the turn system
AddRemovePlayerDemo.prototype._initTurnSystem = function () {
    // use the builder class for setting
    const settingBuilder = new Settings.Builder();
    settingBuilder.setTurnType(this.mTurnType); // 'timed'
    settingBuilder.setMaxUsers(this.mMaxPlayerNum); // max 10 players 
    settingBuilder.setTurnTime(20); // 20 sec per turn
    
    // Transform the builder into setting into TurnSystem
    const setting = settingBuilder.build();
    this.mTurnSystem = new TurnSystem(setting);
    
};

// Called from _setupStatus. Set the parameters (x, y, color, height) of the font
AddRemovePlayerDemo.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// Called from initialize. Setup the last player text
AddRemovePlayerDemo.prototype._setupLastPlayer = function () {
    this.mLastPlayer = new FontRenderable('Last Player: ');
    this.mLastPlayer.setFont(this.kFont);
    this._initText(this.mLastPlayer, 2, 14, [0, 0, 0, 1], 4);
};

// Called from initialize. Setup the Status
AddRemovePlayerDemo.prototype._setupStatus = function () {
    this.mStatus = new FontRenderable('Status: ');
    this.mStatus.setFont(this.kFont);
    this._initText(this.mStatus, 2, 5, [0, 0, 0, 1], 4);
};

// Called from update. check user inputs
AddRemovePlayerDemo.prototype._userInputs = function () {
    // If up key is clicked, add a player
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A)) {
        var user = new User(this.mCurPlayerIndex, "Tom" + this.mCurPlayerIndex, [0,0,0,1], this.kFont);
        this.mTurnSystem.addUser(user);
        this.mCurPlayerIndex++;
    }
    
    // If down key is clicked, delete the last player
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D)) {
        var numPlayers = this.mTurnSystem.getAllUsers().length;
        if (numPlayers > 0) {
            var lastPlayer = this.mTurnSystem.getAllUsers()[numPlayers - 1];
            this.mTurnSystem.removeUser(lastPlayer);
            this.mCurPlayerIndex--;
        }
    }
};

// Called from update. update the last player
AddRemovePlayerDemo.prototype._updateLastPlayer = function () {
    var numPlayers = this.mTurnSystem.getAllUsers().length;
    if (numPlayers > 0) {
        var lastPlayer = this.mTurnSystem.getAllUsers()[numPlayers - 1];
        var infoText = 'Last Player: Index (' + lastPlayer.getIndex() + '), Name (' + lastPlayer.getName() + ')';
        this.mLastPlayer.setText(infoText);
    }
    else {
        this.mLastPlayer.setText('Last Player: None');
    }
};

// Called from update. update the status
AddRemovePlayerDemo.prototype._updateStatus = function () {
    var numPlayers = this.mTurnSystem.getAllUsers().length;
    var statusText = 'Status: Number of Player (' + numPlayers + '), Current User Index (' + this.mCurPlayerIndex + ')';
    this.mStatus.setText(statusText);
};

// Called from _drawComponents. draw user.
AddRemovePlayerDemo.prototype._drawUser = function (cam) {
    var user = this.mTurnSystem.getAllUsers();
    var numPlayer = user.length;
    if (numPlayer > 0) {
        for (var i = 0; i < numPlayer; i++) {
            user[i].draw(cam);
        }
    }
};

// Called from draw. draw the objects in inputted camera.
AddRemovePlayerDemo.prototype._drawComponents = function (cam) {
    this._drawUser(cam);
    this.mLastPlayer.draw(cam);
    this.mStatus.draw(cam);
};
