/** Representation for the action of UserState, if any. */
class Action {
  constructor(user, action) {
    // Reference to the UserState object that invoked the action.
    this.user = user || null;
    // The return value of the action
    this.action = action || null;
  }
}
