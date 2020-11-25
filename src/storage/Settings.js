/** Pomodoro settings class.
 * @class
 * @property {number} work_period_duration - Work period duration in minutes
 * @property {number} nb_work_period - Number of work period
 * @property {number} short_break_duration - Short Break duration in minutes
 * @property {number} long_break_duration - Long Break duration in minutes
 */
class Settings {
  constructor() {
    // ...
  }

  /**
   * Store the settings in persistent data.
   * @return {boolean} True if success else False
   */
  store() {
    // ...
  }

  /**
   * Get the settings in persistent data.
   * @return {Setting} Setting object
   */
  get() {
    // ..
  }
}
