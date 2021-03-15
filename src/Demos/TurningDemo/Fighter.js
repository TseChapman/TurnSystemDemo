class Fighter extends UserState {
  constructor(sprite, pos) {
    super();
    this.name = null;
    this.skillSet = null;
    this.health = null;
    this.moveToMake = null;
    this.renderable = null;
    this.position = pos;
    this.sprite = sprite;
  }

  initialize() {
    this.name = this.name || '';
    this.skillSet = this.skillSet.length
      ? this.skillSet
      : [{ move: 'Punch', damage: 10 }];
    this.health = this.health || 100;

    const fighter = new SpriteRenderable(this.sprite);
    fighter.setColor([1, 1, 1, 0]);
    fighter.getXform().setPosition(this.position[0], this.position[1]);
    fighter.getXform().setSize(25.6, 51.2);
    this.renderable = fighter;
  }

  update() {
    if (!this.isActive) return;
    if (
      gEngine.Input.isKeyClicked(gEngine.Input.keys.One) &&
      this.skillSet.length > 1
    ) {
      this.moveToMake = 1;
      return true;
    }

    if (
      gEngine.Input.isKeyClicked(gEngine.Input.keys.Two) &&
      this.skillSet.length > 2
    ) {
      this.moveToMake = 2;
      return true;
    }
    if (
      gEngine.Input.isKeyClicked(gEngine.Input.keys.Three) &&
      this.skillSet.length > 3
    ) {
      this.moveToMake = 3;
      return true;
    }
    if (
      gEngine.Input.isKeyClicked(gEngine.Input.keys.Zero) &&
      this.skillSet.length > 0
    ) {
      this.moveToMake = 0;
      return true;
    }
    return false;
  }

  draw(cam) {
    this.renderable.draw(cam);
  }

  /**
   * Returns a random attack
   */
  action() {
    const moveIdx =
      this.moveToMake != null
        ? this.moveToMake
        : Math.floor(Math.random() * this.skillSet.length);
    this.moveToMake = null;
    return new Action(this, this.skillSet[moveIdx]);
  }

  /**
   * Adds a move to the users skill set
   * @param {Object} moveData - object with move and damage key value pairs
   */
  addMove(moveData) {
    if (this.skillSet.length >= 4) {
      return;
    }

    this.skillSet.push(moveData);
  }

  /**
   * Sets the skill set for the user. Cannot exceed 4 moves. If more than 4
   * moves, only the first four are used.
   * @param {Array} skillsArr - array with move data information.
   */
  setSkillSet(skillsArr) {
    const editArr = [...skillsArr];
    if (skillsArr.length > 4) {
      editArr.slice(0, 4);
    }
    this.skillSet = editArr;
  }

  /**
   * Sets the users name.
   * @param {String} name - the name to identify the user.
   */
  setUserName(name) {
    this.name = name;
  }

  setHealth(hp) {
    if (hp <= 0) return;
    this.health = hp;
  }

  decreaseHealth(amt) {
    this.health -= amt;
    this.health = this.health <= 0 ? 0 : this.health;
    this._checkHealth();
  }

  _checkHealth() {
    if (this.health < 0) {
      return 'dead';
    }
    return 'alive';
  }
}
