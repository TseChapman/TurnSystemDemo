/**
 * Holds the state of a user.
 */
class UserState {
  constructor() {
    this.isActive = false;
  }

  /**
   * Initializes the User with the data required
   */
  initialize() {}

  /**
   * Updates that the User should run. Example:
   * Checking if the user can move or not (isActive).
   */
  update() {}

  /**
   * Action that a User can do. Example: Invoke an 'attack'
   */
  action() {}

  /**
   * Compares two User states. Returns true if similar.
   */
  equals(otherUserState) {}
}
