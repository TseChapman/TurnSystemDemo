class MainTurnDemo extends Scene {
  constructor() {
    super();
    this.turnSystem = null;
    this.settings = null;
    this.mainCamera = null;
    this.player1Sprite = 'assets/demo1/player1.PNG';
    this.player2Sprite = 'assets/demo1/player2.png';
    this.player1Moves = [];
    this.player2Moves = [];
    this.player1HP = null;
    this.player2HP = null;
    this.font = 'assets/fonts/system-default-font';
    this.movePos = [
      [20, 15],
      [50, 15],
      [20, 10],
      [50, 10],
    ];
    this.player1 = null;
    this.player2 = null;
    this.attackFont = null;
  }

  initialize() {
    this._initSettings();
    this.turnSystem = new TurnSystem(this.settings);
    this.settings = this.turnSystem.settings;
    this.mainCamera = new Camera(vec2.fromValues(50, 50), 100, [
      0,
      0,
      800,
      800,
    ]);
    this.mainCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this._initUserData();
    this._initTimer();
    this._initAttackFont();
  }

  loadScene() {
    gEngine.Textures.loadTexture(this.player1Sprite);
    gEngine.Textures.loadTexture(this.player2Sprite);
    gEngine.Fonts.loadFont(this.font);
  }

  update() {
    this.timer.setText(`Time: ${this.turnSystem.remainingTime}`);
    let movePicked = false;
    movePicked = this.turnSystem.getCurrentUser().update();
    if (movePicked) this.turnSystem.maxOutTimeTicker();
    const action = this.turnSystem.calculateNextTurn();
    if (!action) return;
    const target = this.turnSystem.getCurrentUser();
    target.decreaseHealth(action.action.damage);

    this.player1HP.setText(`HP: ${this.player1.health}`);
    this.player2HP.setText(`HP: ${this.player2.health}`);
    this.attackFont.setText(`Player used: ${action.action.move}`);
    setTimeout(() => {
      this.attackFont.setText(' ');
    }, 1000);
  }

  draw() {
    gEngine.Core.clearCanvas(0.9, 0.9, 0.9, 1);
    this.mainCamera.setupViewProjection();
    for (const user of this.turnSystem.getAllUsers()) {
      user.draw(this.mainCamera);
    }
    this._drawMoves(this.mainCamera);
    this.player1HP.draw(this.mainCamera);
    this.player2HP.draw(this.mainCamera);
    this.timer.draw(this.mainCamera);
    this.attackFont.draw(this.mainCamera);
  }

  _drawMoves(cam) {
    for (const move of this.player1Moves) {
      move.draw(cam);
    }

    for (const move of this.player2Moves) {
      move.draw(cam);
    }
  }

  _initSettings() {
    const settingsBuilder = new Settings.Builder();
    settingsBuilder.setTurnType('timed');
    settingsBuilder.setTurnTime(5);
    this.settings = settingsBuilder.build();
  }

  _initUserData() {
    const user1 = new Fighter(this.player1Sprite, [25, 45]);
    user1.setSkillSet([
      {
        move: 'Kick',
        damage: 5,
      },
      {
        move: 'Uppercut',
        damage: 20,
      },
    ]);
    const user2 = new Fighter(this.player2Sprite, [75, 65]);
    user2.setSkillSet([
      {
        move: 'Tickle',
        damage: 2,
      },
      {
        move: 'Scream',
        damage: 1,
      },
    ]);
    user1.initialize();
    user1.isActive = true;
    user2.initialize();
    this.player1 = user1;
    this.player2 = user2;
    for (let i = 0; i < user1.skillSet.length; i++) {
      const fontMove = new FontRenderable(`[${i}] ${user1.skillSet[i].move}`);
      fontMove.setFont(this.font);
      fontMove.setColor([0, 0, 0, 1]);
      fontMove.getXform().setPosition(this.movePos[i][0], this.movePos[i][1]);
      fontMove.setTextHeight(5);
      this.player1Moves.push(fontMove);
    }

    this.turnSystem.addUser(user1);
    this.turnSystem.addUser(user2);
    this._initPlayerHP();
  }

  _initPlayerHP() {
    const users = this.turnSystem.getAllUsers();
    for (let i = 0; i < users.length; i++) {
      const position = users[i].renderable.getXform().getPosition();
      const hpFont = new FontRenderable(`HP: ${users[i].health}`);
      hpFont.setFont(this.font);
      hpFont.setColor([0, 0, 0, 1]);
      hpFont.getXform().setPosition(position[0] - 5, position[1] + 25);
      hpFont.setTextHeight(2);
      eval(`this.player${i + 1}HP = hpFont`);
    }
  }

  _initTimer() {
    this.timer = new FontRenderable(`Time: ${this.turnSystem.remainingTime}`);
    this.timer.setFont(this.font);
    this.timer.setColor([0, 0, 0, 1]);
    this.timer.getXform().setPosition(50, 98);
    this.timer.setTextHeight(2);
  }
  _initAttackFont() {
    this.attackFont = new FontRenderable(' ');
    this.attackFont.setFont(this.font);
    this.attackFont.setColor([0, 0, 0, 1]);
    this.attackFont.getXform().setPosition(40, 90);
    this.attackFont.setTextHeight(2);
  }
}
