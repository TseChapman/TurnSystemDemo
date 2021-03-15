/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false, Settings: false */
/* find out more about jslint: http://www.jslint.com/help.html */

const actions = {
    NONE : 0,
    TOP_LEFT : 1,
    TOP : 2,
    TOP_RIGHT : 3,
    MID_LEFT : 4,
    MID : 5,
    MID_RIGHT : 6,
    BOT_LEFT : 7,
    BOT : 8,
    BOT_RIGHT : 9
};

const actionTypes = {
    CROSS : 0,
    CIRCLE : 1
};

class ConditionalDemo {
    /*
     * Design:
     * 
     * tic-tac-toe Demo
     * Players: 2
     * Each Player:
     * - Mouse click to place an action
     * - Click 'space' to end the turn
     * 
     * Need a 3 by 3 matrix box
     * 2 sprite: cross and circle
     */
    
    constructor() {
        this.kCrossSprite = 'assets/conditionalDemo/Cross.png';
        this.kCircleSprite = 'assets/conditionalDemo/Circle.png';
        this.kFont = 'assets/fonts/Consolas-24';
        this.mMaxPlayerNum = 2;
        this.mTurnType = 'conditional';
        this.mNumBoxPerRow = 3;
        
        this.mMatrixRenderables = null; // Renderables for the boxes
        this.mCurAction = null;
        this.mCurActionRen = null;
        this.mActionsArr = null; // 3 * 3 actions
        this.mActionsRens = null;
        this.mParameters = null;
        
        this.mIsGameCompleted = false;
        
        this.mCamera = null;
        this.mTurnSystem = null;
        this.mCurrentPlayer = null;
        this.mInstruction = null;
        this.mWinner = null;
    }
    
    // Begin Scene: must load all the scene contents
    // when done 
    //  => start the GameLoop
    // The game loop will call initialize and then update/draw
    loadScene() {
        gEngine.Textures.loadTexture(this.kCrossSprite);
        gEngine.Textures.loadTexture(this.kCircleSprite);
        gEngine.Fonts.loadFont(this.kFont);
    }
    
    // Performs all initialization functions
    //   => Should call gEngine.GameLoop.start(this)!
    initialize() {
        // Initialize matrix renderables
        this._initMatrixRenderables();
        
        // Initialize action double array
        this._initActionArray();
        
        // Initialize Camera
        this._initCamera();
        
        // Initialize TurnSystem
        this._initTurnSystem();
        
        // Initialize the Current Player Status renderable
        this._initCurrentPlayerRenderable();
        
        // Initialize the Instruction font renderable
        this._initInstructionRenderable();
        
        // Initialize the Winner font renderable
        this._initWinnerRenderable();
    }
    
    // update function to be called form EngineCore.GameLoop
    update() {
        if (this.mIsGameCompleted) {
            return;
        }
        
        // Check user Input
        this._userInput();
        
        // update user status
        this._updateCurrentPlayer();
        
        // Check if there is a winner
        this._checkWinner();
        
        this.mTurnSystem.calculateNextTurn();
    }
    
    // draw function to be called from EngineCore.GameLoop
    draw() {
        // Set Canvas background to light gray
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Set the Camera projection
        this.mCamera.setupViewProjection();
        
        // Draw the matrix renderable
        this._drawMatrixRenderables(this.mCamera);
        
        // Draw current action renderable
        this._drawCurActionRen(this.mCamera);
        
        // Draw the action renderables
        this._drawActionRen(this.mCamera);
        
        // Draw the status font renderables
        this._drawFontRenderables(this.mCamera);
    }
    
    // Must unload all resources
    unloadScene() {
        gEngine.Textures.unloadTexture(this.kCrossSprite);
        gEngine.Textures.unloadTexture(this.kCircleSprite);
        gEngine.Fonts.unloadFont(this.kFont);
    }
    
    // Create and return the matrix's border renderable
    _createBorderRen(xPos, yPos, width, height) {
        var ren = new Renderable();
        ren.setColor([0,0,0,1]);
        ren.getXform().setPosition(xPos, yPos);
        ren.getXform().setSize(width, height);
        return ren;
    }
    
    // Initialize the matrix 3 * 3 renderables
    _initMatrixRenderables() {
        // Parameters:
        const center = vec2.fromValues(100,75);
        const boxWidth = 20; // square's width; width = height
        const renWidth = 0.5;
        
        // 8 renderables: top, bottom, left, right, 2 verticles, 2 horizontals
        const top = this._createBorderRen(center[0],                   
                                          center[1] + (boxWidth * 1.5),
                                          boxWidth * this.mNumBoxPerRow,
                                          renWidth);
        const bottom = this._createBorderRen(center[0],
                                             center[1] - (boxWidth * 1.5),
                                             boxWidth * this.mNumBoxPerRow,
                                             renWidth);
        const left = this._createBorderRen(center[0] - (boxWidth * 1.5),
                                           center[1],
                                           renWidth,
                                           boxWidth * this.mNumBoxPerRow);
        const right = this._createBorderRen(center[0] + (boxWidth * 1.5),
                                           center[1],
                                           renWidth,
                                           boxWidth * this.mNumBoxPerRow);
        const leftVertical = this._createBorderRen(center[0] - (boxWidth * 0.5),
                                                   center[1],
                                                   renWidth,
                                                   boxWidth * this.mNumBoxPerRow);                                   
        const rightVertical = this._createBorderRen(center[0] + (boxWidth * 0.5),
                                                    center[1],
                                                    renWidth,
                                                    boxWidth * this.mNumBoxPerRow);
        const topHorizontal = this._createBorderRen(center[0],
                                                    center[1] + (boxWidth * 0.5),
                                                    boxWidth * this.mNumBoxPerRow,
                                                    renWidth);
        const bottomHorizontal = this._createBorderRen(center[0],
                                                       center[1] - (boxWidth * 0.5),
                                                       boxWidth * this.mNumBoxPerRow,
                                                       renWidth);
                                                       
        this.mMatrixRenderables = {top, bottom, left, right, leftVertical, rightVertical, topHorizontal, bottomHorizontal};
        this.mParameters = new Parameters(center, boxWidth, renWidth);
    }
    
    // Initialize the action's 3 * 3 double array
    _initActionArray() {
        this.mActionsArr = [];
        this.mActionsRens = [];
        for (var i = 0; i < 3; i++) {
            this.mActionsArr.push([-1,-1,-1]);
        }
    }
    
    // Called from initialize. Initialize the mCamera
    _initCamera() {
        // Set up the cameras
        this.mCamera = new Camera(
          vec2.fromValues(100, 75), // position of the camera
          200, // width of camera
          [0, 0, 800, 600] // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray
    }
    
    // Called from _initTurnSystem. Initialize the users in the game.
    _initUsers() {
        var player1 = new Player(0, "Player 1: Cross", [0,0,0,1], this.kFont, this.kCrossSprite, actionTypes.CROSS, 2, 15);
        var player2 = new Player(1, "Player 2: Circle", [0,0,0,1], this.kFont, this.kCircleSprite, actionTypes.CIRCLE, 2, 10);
        this.mTurnSystem.addUser(player1);
        this.mTurnSystem.addUser(player2);
    }
    
    // Called from initialize. Initialize the mTurnSystem
    _initTurnSystem() {
        // Define Conditional callbackfunction
        function conditionFun (user) {
            return user.isMetCondition;
        }
        
        // use the builder class for setting
        var settingBuilder = new Settings.Builder();
        settingBuilder.setTurnType(this.mTurnType); // 'conditional'
        settingBuilder.setMaxUsers(this.mMaxPlayerNum); // only 2 players 
        settingBuilder.setCallbackFunction(conditionFun);

        // Transform the builder into setting into TurnSystem
        const setting = settingBuilder.build();
        this.mTurnSystem = new TurnSystem(setting);
        this._initUsers();
    }
    
    // Initialize the font renderable's parameters
    _initText(font, posX, posY, color, textH) {
        font.setColor(color);
        font.getXform().setPosition(posX, posY);
        font.setTextHeight(textH);
    }
    
    // Initialize the CurrentPlayer font renderable
    _initCurrentPlayerRenderable() {
        this.mCurrentPlayer = new FontRenderable('Current Player: ');
        this.mCurrentPlayer.setFont(this.kFont);
        this._initText(this.mCurrentPlayer, 2, 5, [0, 0, 0, 1], 4);
    }
    
    // Initialize the Instruction font renderable
    _initInstructionRenderable() {
        this.mInstruction = new FontRenderable('E to End turn, left click to select box');
        this.mInstruction.setFont(this.kFont);
        this._initText(this.mInstruction, 2, 147, [0, 0, 0, 1], 4);
    }
    
    // Initialize the Winner font renderable
    _initWinnerRenderable() {
        this.mWinner = new FontRenderable('Winner is');
        this.mWinner.setFont(this.kFont);
        this._initText(this.mWinner, 2, 140, [0, 0, 0, 1], 4);
    }
    
    // Player makes a move
    _playerAction() {
        const xPos = this.mCamera.mouseWCX();
        const yPos = this.mCamera.mouseWCY();
        
        const maxX = this.mParameters.mMaxX;
        const minX = this.mParameters.mMinX;
        const maxY = this.mParameters.mMaxY;
        const minY = this.mParameters.mMinY;
        const boxWidth = this.mParameters.mBoxWidth;
        //console.log(`xPos: ${xPos} , yPos: ${yPos} , maxX: ${maxX} , minX: ${minX} , maxY: ${maxY} , minY: ${minY}`);
        
        // Test which box the mouse position falls within
        var action = actions.NONE;
        
        // Test TOP_LEFT
        if ((xPos >= minX && xPos < (minX + boxWidth)) &&
            (yPos <= maxY && yPos > (maxY - boxWidth))) {
            action = actions.TOP_LEFT;
        }
        // Test TOP
        if ((xPos >= (minX + boxWidth) && xPos < (minX + 2 * boxWidth)) &&
            (yPos <= maxY && yPos > (maxY - boxWidth))) {
            action = actions.TOP;
        }
        // Test TOP_RIGHT
        if ((xPos >= (minX + 2 * boxWidth) && xPos < maxX) &&
            (yPos <= maxY && yPos > (maxY - boxWidth))) {
            action = actions.TOP_RIGHT;
        }
        // Test MID_LEFT
        if ((xPos >= minX && xPos < (minX + boxWidth)) &&
            (yPos <= (maxY - boxWidth) && yPos > (maxY - 2 * boxWidth))) {
            action = actions.MID_LEFT;
        }
        // Test MID
        if ((xPos >= (minX + boxWidth) && xPos < (minX + 2 * boxWidth)) &&
            (yPos <= (maxY - boxWidth) && yPos > (maxY - 2 * boxWidth))) {
            action = actions.MID;
        }
        // Test MID_RIGHT
        if ((xPos >= (minX + 2 * boxWidth) && xPos < maxX) &&
            (yPos <= (maxY - boxWidth) && yPos > (maxY - 2 * boxWidth))) {
            action = actions.MID_RIGHT;
        }
        // Test BOT_LEFT
        if ((xPos >= minX && xPos < (minX + boxWidth)) &&
            (yPos <= (minY + boxWidth) && yPos > minY)) {
            action = actions.BOT_LEFT;
        }
        // Test BOT
        if ((xPos >= (minX + boxWidth) && xPos < (minX + 2 * boxWidth)) &&
            (yPos <= (minY + boxWidth) && yPos > minY)) {
            action = actions.BOT;
        }
        // Test BOT_RIGHT
        if ((xPos >= (minX + 2 * boxWidth) && xPos < maxX) &&
            (yPos <= (minY + boxWidth) && yPos > minY)) {
            action = actions.BOT_RIGHT;
        }
        return action;
    }
    
    _isValidAction(action) {
        // Check if the action is already taken
        var row = Math.floor((action - 1)/3);
        var col = (action - 1)%3;
        if (this.mActionsArr[row][col] === -1) {
            return true;
        }
        return false;
    }
    
    _setupActionRenderable() {
        var sprite = this.mTurnSystem.getCurrentUser().getMarker();
        var position = this.mParameters.mPositionDict[this.mCurAction];
        var width = this.mParameters.mCurActionRenWidth;
        
        var ren = new SpriteRenderable(sprite);
        ren.setColor([1, 1, 1, 0]);
        ren.getXform().setPosition(position[0], position[1]);
        ren.getXform().setSize(width, width);
        ren.setElementPixelPositions(0, 512, 0, 512);
        
        this.mActionsRens.push(ren);
    }
    
    _modifyActionArr() {
        var row = Math.floor((this.mCurAction - 1)/3);
        var col = (this.mCurAction - 1)%3;
        this.mActionsArr[row][col] = this.mTurnSystem.getCurrentUser().getActionType();
    }
    
    _setupCurActionRenderable() {
        if (this.mCurActionRen === null) {
            var boxWidth = this.mParameters.mCurActionRenWidth;
            // Create the renderable
            this.mCurActionRen = new Renderable();
            this.mCurActionRen.setColor([1,0,0,1]);
            this.mCurActionRen.getXform().setSize(boxWidth, boxWidth);
        }
        
        var position = this.mParameters.mPositionDict[this.mCurAction];
        // Translate the position based on action
        this.mCurActionRen.getXform().setPosition(position[0],position[1]);
    }
    
    // Check user's input
    _userInput() {
        // End turn
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.E)) {
            if (this.mTurnSystem.getCurrentUser().mIsMadeMove === true) {
                this.mTurnSystem.getCurrentUser().isMetCondition = true;
                
                // setup the renderable at action position
                this._setupActionRenderable();
                
                // modify the action array to store the board
                this._modifyActionArr();
                
                // reset current action
                this.mCurAction = null;
                this.mCurActionRen = null;
                this.mTurnSystem.getCurrentUser().mIsMadeMove = false;
            }
        }
        
        if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
            var action = this._playerAction();
            //console.log(`action = ${action}`);
            if (action !== actions.NONE && this._isValidAction(action)) {
                this.mCurAction = action;
                this._setupCurActionRenderable();
                this.mTurnSystem.getCurrentUser().mIsMadeMove = true;
            }
        }
    }
    
    // Update the text in the CurrentPlayer font renderable based on current player
    _updateCurrentPlayer() {
        var curPlayer = this.mTurnSystem.getCurrentUser();
        this.mCurrentPlayer.setText(`Current Player: Player ${curPlayer.getIndex() + 1}`);
    }
    
    _updateWinnerText() {
        var winnerString = this.mTurnSystem.getCurrentUser().getName();
        this.mWinner.setText(`Winner is ${winnerString}`);
    }
    
    // Check if there is a winner in the game
    _checkWinner() {
        var numBox = this.mNumBoxPerRow;
        var isEmptyBox = false;
        
        // Check horizontal
        for (var row = 0; row < numBox; row++) {
            var rowSum = 0;
            var isRowComplete = true;
            for (var col = 0; col < numBox; col++) {
                var action = this.mActionsArr[row][col];
                if (action === -1) {
                    isRowComplete = false;
                    isEmptyBox = true;
                    break;
                }
                rowSum += action;
            }
            if (!isRowComplete) {
                continue;
            }
            
            if (rowSum === 0) {
                console.log('Cross Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
            else if (rowSum === 3) {
                console.log('Circle Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
        }
        
        // Check Vertical
        for (var col = 0; col < numBox; col++) {
            var colSum = 0;
            var isColComplete = true;
            for (var row = 0; row < numBox; row++) {
                var action = this.mActionsArr[row][col];
                if (action === -1) {
                    isColComplete = false;
                    isEmptyBox = true;
                    break;
                }
                colSum += action;
            }
            
            if (!isColComplete) {
                continue;
            }
            
            if (colSum === 0) {
                console.log('Cross Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
            else if (colSum === 3) {
                console.log('Circle Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
        }
        
        if (this.mActionsArr[2][0] !== -1 && this.mActionsArr[1][1] !== -1 && this.mActionsArr[0][2] !== -1) {
            var sum = this.mActionsArr[2][0] + this.mActionsArr[1][1] + this.mActionsArr[0][2];
            if (sum === 0) {
                console.log('Cross Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
            else if (sum === 3) {
                console.log('Circle Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
        }
        else {
            isEmptyBox = true;
        }
        
        if (this.mActionsArr[0][0] !== -1 && this.mActionsArr[1][1] !== -1 && this.mActionsArr[2][2] !== -1) {
            var sum = this.mActionsArr[0][0] + this.mActionsArr[1][1] + this.mActionsArr[2][2];
            if (sum === 0) {
                console.log('Cross Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
            else if (sum === 3) {
                console.log('Circle Win');
                this._updateWinnerText();
                this.mIsGameCompleted = true;
            }
        }
        else {
            isEmptyBox = true;
        }
        
        if (!isEmptyBox && !this.mIsGameCompleted) {
            console.log('Draw');
            this.mWinner.setText("Draw");
            this.mIsGameCompleted = true;
        }
    }
    
    // Draw the matrix renderables
    _drawMatrixRenderables(cam) {
        this.mMatrixRenderables.top.draw(cam);
        this.mMatrixRenderables.bottom.draw(cam);
        this.mMatrixRenderables.left.draw(cam);
        this.mMatrixRenderables.right.draw(cam);
        this.mMatrixRenderables.leftVertical.draw(cam);
        this.mMatrixRenderables.rightVertical.draw(cam);
        this.mMatrixRenderables.topHorizontal.draw(cam);
        this.mMatrixRenderables.bottomHorizontal.draw(cam);
    }
    
    // Draw Current action renderable, if any
    _drawCurActionRen(cam) {
        if (this.mCurActionRen === null) {
            return;
        }
        this.mCurActionRen.draw(cam);
    }
    
    // Draw the action sprite renderables, if any
    _drawActionRen(cam) {
        var size = this.mActionsRens.length;
        if (size <= 0) {
            return;
        }
        for (var i = 0; i < size; i++) {
            this.mActionsRens[i].draw(cam);
        }
    }
    
    // Draw all the Font renderables
    _drawFontRenderables(cam) {
        this.mCurrentPlayer.draw(cam);
        this.mInstruction.draw(cam);
        
        var numPlayers = this.mTurnSystem.getNumUsers();
        for (var i = 0; i < numPlayers; i++) {
            this.mTurnSystem.getUserByIndex(i).draw(cam);
        }
        
        if (this.mIsGameCompleted) {
            this.mWinner.draw(cam);
        }
    }
}

class Parameters  {
    constructor(center, boxWidth, renWidth) {
        // Parameters:
        this.mCenter = center;
        this.mBoxWidth = boxWidth; // square's width; width = height
        this.mRenWidth = renWidth;
        this.mMaxX = center[0] + (boxWidth * 1.5);
        this.mMinX = center[0] - (boxWidth * 1.5);
        this.mMaxY = center[1] + (boxWidth * 1.5);
        this.mMinY = center[1] - (boxWidth * 1.5);
        this.mCurActionRenWidth = boxWidth/2;
        this.mPositionDict = {
            [actions.TOP_LEFT] : vec2.fromValues(center[0] - boxWidth, center[1] + boxWidth),
            [actions.TOP] : vec2.fromValues(center[0], center[1] + boxWidth),
            [actions.TOP_RIGHT] : vec2.fromValues(center[0] + boxWidth, center[1] + boxWidth),
            [actions.MID_LEFT] : vec2.fromValues(center[0]- boxWidth, center[1]),
            [actions.MID] : center,
            [actions.MID_RIGHT] : vec2.fromValues(center[0] + boxWidth, center[1]),
            [actions.BOT_LEFT] : vec2.fromValues(center[0] - boxWidth, center[1] - boxWidth),
            [actions.BOT] : vec2.fromValues(center[0], center[1] - boxWidth),
            [actions.BOT_RIGHT] : vec2.fromValues(center[0] + boxWidth, center[1] - boxWidth)
        };
    }
}
