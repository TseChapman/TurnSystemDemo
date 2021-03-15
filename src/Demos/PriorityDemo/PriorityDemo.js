/**
 * Demo demonstrating the priority turn system.
 */
class PriorityDemo extends Scene {
  constructor() {
    super();
    this.turnSystem = null;
    this.diceSprites = [
      'assets/priorityDemo/dice1.png',
      'assets/priorityDemo/dice2.png',
      'assets/priorityDemo/dice3.png',
      'assets/priorityDemo/dice4.png',
    ];
    this.font = 'assets/fonts/system-default-font';
    this.orderFont = null;
    this.playerOrderRenders = null;
    this.gameStart = false;
    this.timerOn = false;
    this.currentPlayerFont = null;
  }

  loadScene() {
    for (const diceSprite of this.diceSprites) {
      gEngine.Textures.loadTexture(diceSprite);
    }
    gEngine.Fonts.loadFont(this.font);
  }

  initialize() {
    this._initTurnSystem();
    this.mainCamera = new Camera(vec2.fromValues(50, 50), 100, [
      0,
      0,
      800,
      800,
    ]);
    this.mainCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this._initOrderFont();
  }

  draw() {
    gEngine.Core.clearCanvas(0.9, 0.9, 0.9, 1);
    this.mainCamera.setupViewProjection();
    // Draw every user on the screen normally
    if (!this.gameStart) {
      for (const user of this.turnSystem.getAllUsers()) {
        user.draw(this.mainCamera);
      }
    } else {
      this.turnSystem.getCurrentUser().draw(this.mainCamera);
    }

    // draw the rolled dice if a new player was added
    if (this.rolledDice) {
      this.rolledDice.draw(this.mainCamera);
    }

    // draw the order font
    this.orderFont.draw(this.mainCamera);

    // if there are players, draw their current order in the turn system.
    if (this.playerOrderRenders) {
      for (const user of this.playerOrderRenders) {
        user[0].draw(this.mainCamera);
        user[1].draw(this.mainCamera);
      }
    }

    this.currentPlayerFont?.draw(this.mainCamera);
  }

  update() {
    this._checkInputKeys();
    if (this.gameStart) {
      this.buttonSmasher();
    }
  }

  /**
   * Adds a new player to the game.
   */
  addNewPlayer(name, color) {
    const rank = Math.floor(Math.random() * 4);
    // draw a di to show what the user rolled.
    this.rolledDice = new SpriteRenderable(this.diceSprites[rank]);
    this.rolledDice.getXform().setPosition(50, 60);
    this.rolledDice.getXform().setSize(5, 5);
    if (!this.turnSystem.addUser(new PriorityPlayer([50, 50], name, color)))
      return;
    let currDi = this.rolledDice;
    setTimeout(() => {
      // prevent rolledDi from disappearing after 1ms
      if (currDi === this.rolledDice) {
        this.rolledDice = null;
      }
    }, 1000);

    // set the rank to the new user.
    this.turnSystem.getUserByIndex(
      this.turnSystem.getAllUsers().length - 1
    ).rank = rank + 1;
  }

  /**
   * Removes the last player added to the game.
   */
  removeLastPlayer() {
    this.turnSystem.removeUser(
      this.turnSystem.getUserByIndex(this.turnSystem.getAllUsers().length - 1)
    );
  }

  priorityCallback(usersArray) {
    // sort based on rank.
    usersArray.sort((a, b) => {
      return a.rank - b.rank;
    });
  }

  _initTurnSystem() {
    const settingsBuilder = new Settings.Builder();
    settingsBuilder.setMaxUsers(4);
    settingsBuilder.setTurnType('priority');
    settingsBuilder.setCallbackFunction(this.priorityCallback);
    this.turnSystem = new TurnSystem(settingsBuilder.build());
  }

  _initOrderFont() {
    this.orderFont = new FontRenderable('Current Order:');
    this.orderFont.setFont(this.font);
    this.orderFont.setColor([0, 0, 0, 1]);
    this.orderFont.getXform().setPosition(40, 98);
    this.orderFont.setTextHeight(2);
  }

  _checkInputKeys() {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Escape)) {
      this.turnSystem.calculateNextTurn();
      this.gameStart = true;
      if (!this.currentPlayerFont) {
        this.currentPlayerFont = new FontRenderable(
          `Current Player: ${this.turnSystem.getCurrentUser().name}`
        );
        this.currentPlayerFont.setFont(this.font);
        this.currentPlayerFont.setColor([0, 0, 0, 1]);
        this.currentPlayerFont.getXform().setPosition(5, 5);
        this.currentPlayerFont.setTextHeight(2);
      }
      console.log('hi');
    }
  }

  /**
   * Initializes the renderables for the order drawing.
   */
  _displayPlayerOrder() {
    this.turnSystem.calculateNextTurn();
    // create a clone of all the players in the turn system.
    let allPlayers = this.turnSystem.getAllUsers().map((user) => user.clone());
    // start below the 'Current Order' font.
    const posStart = [35, 90];

    // set the clone positions
    allPlayers = allPlayers.map((user) => {
      const nameTag = new FontRenderable(`${user.rank}.${user.name}`);
      nameTag.setFont(this.font);
      nameTag.setColor([0, 0, 0, 1]);
      nameTag.setTextHeight(1);
      nameTag.getXform().setPosition(posStart[0] - 0.5, posStart[1] - 2);
      const userXform = user.renderable.getXform();
      user.position = posStart;
      userXform.setPosition(posStart[0], posStart[1]);
      userXform.setSize(2.5, 2.5);
      posStart[0] += 8;
      return [user, nameTag];
    });

    // save the changes for to draw later.
    this.playerOrderRenders = allPlayers;
    this._displayCurrentPlayer();
  }

  _displayCurrentPlayer() {
    if (!this.gameStart) return;
    this.currentPlayerFont.setText(
      `Current Player: ${this.turnSystem.getCurrentUser().name}`
    );
  }

  buttonSmasher() {
    const activePlayer = this.turnSystem.getCurrentUser();
    if (!activePlayer) return;
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
      activePlayer.score++;
      console.log(activePlayer.score);
    }
    if (this.timerOn) return;
    this.timerOn = true;
    setTimeout(() => {
      this.timerOn = false;
      activePlayer.rank = activePlayer.score;
      this._displayPlayerOrder();
    }, 5000);
  }
}
