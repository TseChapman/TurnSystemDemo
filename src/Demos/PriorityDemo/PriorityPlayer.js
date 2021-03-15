class PriorityPlayer extends UserState {
  constructor(pos, name, color) {
    super();
    this.rank = null;
    this.name = name;
    this.renderable = null;
    this.color = color || [1, 0, 0, 1];
    this.position = pos;
    this.score = 0;
    this.initialize();
  }

  initialize() {
    this.renderable = new Renderable();
    this.renderable.setColor(this.color);
    this.renderable.getXform().setPosition(this.position[0], this.position[1]);
    this.renderable.getXform().setSize(10, 10);
  }

  update() {}

  draw(cam) {
    this.renderable.draw(cam);
  }

  action() {}

  equals(other) {
    if (other.constructor.name !== 'PriorityPlayer') return false;
    const isRankEqual = this.rank === other.rank;
    const isNameEqual = this.name === other.name;
    const isColorEqual = this.color.every((v, i) => v === other.color[i]);
    const isPositionEqual = this.position.every(
      (v, i) => v === other.position[i]
    );
    const isRenderableEqual = this.renderable === other.renderable;
    const isScoreEqual = this.score === other.score;
    return (
      isRankEqual &&
      isNameEqual &&
      isColorEqual &&
      isPositionEqual &&
      isRenderableEqual &&
      isScoreEqual
    );
  }

  clone() {
    const clonePlayer = new PriorityPlayer(
      this.position,
      this.name,
      this.color
    );
    clonePlayer.rank = this.rank;
    clonePlayer.score = this.score;
    return clonePlayer;
  }
}
