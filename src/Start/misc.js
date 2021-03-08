window.onload = () => {
  let myGame;
  let gamePick = false;
  document.onkeydown = (event) => {
    if (event.key.toLowerCase() === '/') {
      myGame = gamePick ? new MainTurnDemo() : new AddRemovePlayerDemo();
      gEngine.Core.initializeEngineCore('GLCanvas', myGame);
      gamePick = !gamePick;
    }
  };
  myGame = new MainTurnDemo();
  gEngine.Core.initializeEngineCore('GLCanvas', myGame);
};
