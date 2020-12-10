/** Pomodoro session class.
 * @class
 * @param {string} name - Name of the session.
 * @property {string} start_time - Starting time of the session
 * @property {string} end_time - End time of the session
 * @property {number} nb_work_periods - Number of work periods
 * @property {number} break_duration - Break duration in minutes
 * @property {number} work_period_duration - Work period duration in minutes
 */
class Session {
  constructor(name) {
    // ...
  }

  /**
   * End a session.
   * @return {boolean} True if success else False
   */
  end() {
  // ...
  }

  /**
   * Store the session in persistent data.
   * @return {number} id of the session if success.
   */
  store() {
  // ...
  }
}
