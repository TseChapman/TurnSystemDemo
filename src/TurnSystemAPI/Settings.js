/**
 * Settings Class
 *
 * Manages settings for TurnSystem Class. Developers can specify the turn type,
 * maximum number of users, callback function, and amount of time each turn
 * should take.
 */
class Settings {
  /**
   * Constructs a Settings class with the builder object provided, if any.
   * @param {Builder} builder - (Optional)
   */
  constructor(builder) {
    // when no parameters are passed in aka default constructor
    if (builder == undefined) {
      return new Settings.Builder().build();
    }

    this.turnType = builder.turnType;
    this.maxUsers = builder.maxUsers;
    this.callbackFunction = builder.callbackFunction;
    this.turnTime = builder.turnTime;
  }

  /**
   * Returns the turn type for the TurnSystem.
   */
  getTurnType() {
    return this.turnType;
  }

  /**
   * Returns the maximum number of users supported.
   */
  getMaxUsers() {
    return this.maxUsers;
  }

  /**
   * Returns the callback function to be used with priority and conditional
   * turn systems.
   */
  getCallbackFunction() {
    return this.callbackFunction;
  }

  /**
   * Returns the amount of time alloted for a turn.
   */
  getTurnTime() {
    return this.turnTime;
  }
}

/**
 * Static Builder class to build a Settings object.
 */
Settings.Builder = class {
  /**
   * Default constructor with default settings.
   */
  constructor() {
    this.turnType = 'timed';
    this.maxUsers = 2;
    this.callbackFunction = null;
    this.turnTime = 60;
  }

  /**
   * Sets the turn type for the TurnSystem and returns the updated Builder
   * object.
   * @param {String} type - Must be of value 'timed', 'priority', or
   *                        'conditional'.
   */
  setTurnType(type) {
    if (!type instanceof String) {
      console.error(`${type} is not a string. It is a ${typeof type}.`);
      return null;
    }

    const lcType = type.toLowerCase();
    if (lcType === 'timed' || lcType === 'priority' || lcType === 'conditional')
      this.turnType = lcType;
    else
      console.error(
        'InvalidTypeError: String passed in is not of value "timed," "priority," or "conditional."'
      );
    return this;
  }

  /**
   * Sets the maximum number of users supported for the TurnSystem and returns
   * the updated Builder object.
   * @param {Number} max - the number of users supported.
   */
  setMaxUsers(max) {
    if (!max instanceof Number) {
      console.error(`Value passed in must be a number. Not ${typeof max}.`);
      return null;
    }

    if (max <= 0) {
      console.error('Minimum number of users must be 1.');
      return null;
    }

    this.maxUsers = max;
    return this;
  }

  /**
   * Sets the callback function to be used with priority and conditional
   * TurnSystem and returns the updated Builder object.
   * @param {Function} callback - function to be called in priority/conditional
   *                              turn systems.
   */
  setCallbackFunction(callback) {
    if (this.turnTime === 'timed') {
      console.warn(
        `TurnType is set to timed. The callback function will be ignored if not changed.`
      );
    }
    this.callbackFunction = callback;
    return this;
  }

  /**
   * Sets the amount of time to allot for a turn with timed TurnSystem and
   * returns the updated Builder object.
   * @param {Number} time - amount of time to allot for a turn.
   */
  setTurnTime(time) {
    if (!time instanceof Number) {
      console.error(`Time must be a number.`);
      return null;
    }

    if (time < 0) {
      console.error(`Cannot have a negative amount of time`);
      return null;
    }

    if (this.turnTime !== null && this.turnType !== 'timed') {
      console.warn(
        `TurnTime is set. However, turn type is not set to timed. TurnTimed will be ignored if not changed.`
      );
    }
    this.turnTime = time;
    return this;
  }

  /**
   * Returns a Settings object with all values set within the Builder.
   */
  build() {
    if (
      (this.turnType === 'conditional' || this.turnType === 'priority') &&
      this.callbackFunction === null
    ) {
      console.error(
        'NoCallbackError: Conditional/Priority turn type was specified. However, no callback function was set.'
      );
      return null;
    }
    return new Settings(this);
  }
};
