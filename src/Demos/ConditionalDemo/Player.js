/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Player extends UserState {
    constructor(index, name, color, font, marker, actionType, xPos, yPos) {
        super();
        this.mIndex = index;
        this.mName = name;
        this.mColor = color;
        this.kFont = font;
        this.kMarker = marker;
        this.mActionType = actionType;
        
        this.mIsMadeMove = false;
        
        this.mRenderable = null;
        this._initialize(xPos, yPos);
    }
    
    getIndex() { return this.mIndex; }
    
    getName() { return this.mName; }
    
    getMarker() { return this.kMarker; }
    
    getActionType() { return this.mActionType; }
    
    draw(cam) {
        this.mRenderable.draw(cam);
    }
    
    _initText(font, posX, posY, color, textH) {
        font.setColor(color);
        font.getXform().setPosition(posX, posY);
        font.setTextHeight(textH);
    }
    
    _initialize(x, y) {
        this.mRenderable = new FontRenderable(this.mName);
        this.mRenderable.setFont(this.kFont);
        this._initText(this.mRenderable, x, y, this.mColor, 4);
    }
}

