/**
 * Start timer when current session is none or pause, and also un-pause breaks.
 *
 * This is bound to an onclick action.
 */
function start() {
  if (totalSecs >= 0) {
    if (currSession === sessionStatus.NOSESSION) {
      currDate = new Date();
      workDate = currDate.toLocaleDateString();
      workTime = currDate.toLocaleTimeString();
      currWorkPeriod = 1;
      currSession = sessionStatus.WORKING;
      intervalID = setInterval(showtime, 1000);
    } else if (currSession === sessionStatus.WORK_PAUSE) {
      currSession = sessionStatus.WORKING;
      intervalID = setInterval(showtime, 1000);
    } else if (currSession === sessionStatus.CHILL_PAUSE) {
      currSession = sessionStatus.BREAK;
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
  if (currSession === sessionStatus.NOSESSION) {
    return;
  }
  if (currSession === sessionStatus.WORKING) {
    currSession = sessionStatus.WORK_PAUSE;
  }
  if (currSession === sessionStatus.BREAK) {
    currSession = sessionStatus.CHILL_PAUSE;
  }

  clearInterval(intervalID);
  document.getElementById("status").innerHTML = "Paused.";
}

module.exports = { start, stop };
