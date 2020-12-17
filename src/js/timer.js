/**
 * Start timer when current session is none or pause, and also un-pause breaks.
 *
 * This is bound to an onclick action.
 */
function start() {
  if (totalSecs >= 0) {
    let shouldSetInterval = false;
    if (currSession === sessionStatusObj.NOSESSION) {
      currDate = new Date();
      workDate = currDate.toLocaleDateString();
      workTime = currDate.toLocaleTimeString();
      currWorkPeriod = 1;
      currSession = sessionStatusObj.WORKING;
      shouldSetInterval = true;
    } else if (currSession === sessionStatusObj.WORK_PAUSE) {
      currSession = sessionStatusObj.WORKING;
      shouldSetInterval = true;
    } else if (currSession === sessionStatusObj.CHILL_PAUSE) {
      currSession = sessionStatusObj.BREAK;
      shouldSetInterval = true;
    }
    if (shouldSetInterval) {
      intervalID = setInterval(showtime, 1000);
    }
  }
}

/**
 * Pause timer when current session is break or work.
 *
 * This is bound to an onclick action.
 */
function stop() {
  if (currSession === sessionStatusObj.NOSESSION) {
    return;
  }
  if (currSession === sessionStatusObj.WORKING) {
    currSession = sessionStatusObj.WORK_PAUSE;
  }
  if (currSession === sessionStatusObj.BREAK) {
    currSession = sessionStatusObj.CHILL_PAUSE;
  }

  clearInterval(intervalID);
  document.getElementById("status").innerHTML = "Paused.";
}

module.exports = { start, stop };
