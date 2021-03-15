/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class User {
  constructor(index, name, color, font) {
    this.kFont = font;
    this.mIndex = index;
    this.mName = name;
    this.mRenderable = null;
    this.mColor = color;
    this.initialize();
  }

  equals(other) {
    if (other.constructor.name !== 'User') return false;
    const isFontEqual = this.kFont === other.kFont;
    const isIndexEqual = this.mIndex === other.kFont;
    const isNameEqual = this.mName === other.mName;
    const isRenderable = this.mRenderable === other.mRenderable;
    const isColorEqual = this.mColor.every((v, i) => v === other.mColor[i]);
    return (
      isFontEqual && isIndexEqual && isNameEqual && isRenderable && isColorEqual
    );
  }

  setIndex(index) {
    this.mIndex = index;
  }

  setName(name) {
    this.mName = name;
  }

  setColor(color) {
    this.mColor = color;
  }

  getIndex() {
    return this.mIndex;
  }

  getName() {
    return this.mName;
  }

  getColor() {
    return this.mColor;
  }

  initialize() {
    this.mRenderable = new FontRenderable(this.mName);
    this.mRenderable.setFont(this.kFont);
    var x = Math.random() * 200;
    var y = Math.random() * 150;
    this._initText(this.mRenderable, x, y, this.mColor, 4);
  }

  draw(cam) {
    this.mRenderable.draw(cam);
  }

  _initText(font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
  }
}
