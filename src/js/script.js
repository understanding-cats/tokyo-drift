const { remote, session } = require("electron");

const timer = require("../js/timer");
const { sessionStatus, storeSessionToFile } = require("../js/session");
const settings = require("../js/settings");
const utils = require("../js/utils");
const notification = require("../js/notification");

/** Displays current session status on html page
 * @param {object} currStatus - Object for current session status
 * @param {number} periodNum - current period number
 */
function showstatus(currStatus, periodNum) {
  if (currStatus === sessionStatus.NOSESSION) {
    document.getElementById("status").innerText = `Pomodoro${periodNum}`;
  }
  if (
    currStatus === sessionStatus.WORKING ||
    currStatus === sessionStatus.WORK_PAUSE
  ) {
    document.getElementById("status").innerText = `Working... (${periodNum})`;
  }
  if (
    currStatus === sessionStatus.BREAK ||
    currStatus === sessionStatus.CHILL_PAUSE
  ) {
    document.getElementById("status").innerText = `Chilling... (${periodNum})`;
  }
}

/**
 * Displays remaining time in MM:SS format.
 *
 * @param {number} secs Remaining seconds in current session.
 */
function updateClock(secs) {
  document.getElementById(
    "count_down"
  ).innerHTML = utils.secsToHumanReadableTime(secs);
}

/** reload current page.
 */
function clearAll() {
  location.reload();
}

/** utility function that decreases number by one
 * @param {number} secs
 */
function decreaseTime(secs) {
  return secs - 1;
}

/** pops notification when a task finishes. Also pops a dialogue box to ask if user wants to go back to main menu.
 */
function finishSessions() {
  clearInterval(intervalID);
  storeSessionToFile(
    "seshistory.json",
    workDate,
    taskName,
    workTime,
    workInSec,
    sbreakInSec,
    workPeriods
  );
  notification.showNotification(
    notification.notificationKind.SESSIONS_COMPLETE
  ); // show desktop notification for all sessions end
  const r = confirm("Sessions complete! Go back to menu?");
  if (r) {
    location.href = "home.html";
  } else {
    clearAll();
  }
}

/** This function is called when session switches to "work session"
 * when called, it pops a notification and changes html styles.
 * @param {number} workPeriod - Current work period
 * @param {number} sessionStatus - Current session status
 * @param {number} secs - remaining seconds
 * @return update workPeriod, sessionStatus, and secs
 */
function startWorkSession(workPeriod, sessionStatus, secs) {
  workPeriod += 1;
  // switch to work
  notification.showNotification(
    notification.notificationKind.START_WORK_SESSION
  ); // show desktop notification for one session starts
  sessionStatus = 1;
  secs = totalWork - 1;
  document.body.style.backgroundColor = "#F1DCDC";
  document.getElementById("tomato_img").src = "../images/tomato_tran.png";
  return { workPeriod: workPeriod, sessionStatus: sessionStatus, secs: secs };
}

/** This function is called when session switches to "break session"
 * when called, it pops a notification and changes html styles.
 * @param {number} secs - remaining seconds
 * @param {number} sessionStatus - Current session status
 * @return update workPeriod, sessionStatus, and secs
 */
function takeBreak(secs, sessionStatus) {
  if (currWorkPeriod % 4 !== 0) {
    secs = totalBreak;
  } else {
    secs = totalLongBreak;
  }
  // switch to break mode
  notification.showNotification(
    notification.notificationKind.WORK_SESSION_DONE
  ); // show desktop notification for one session ends
  sessionStatus = 2;
  document.body.style.backgroundColor = "#D0E9F3";
  document.getElementById("tomato_img").src = "../images/tomatoblue_tran.png";
  return { secs: secs, sessionStatus: sessionStatus };
}

/**
 * This function is called every second by setInterval().
 *
 * Its handles switching states when the current session ends.
 */
function showtime() {
  if (currSession === sessionStatus.WORKING) {
    if (totalSecs >= 0) {
      totalSecs = decreaseTime(totalSecs);
    } else {
      // working and remaining secs <= 0
      breakUpdates = takeBreak(totalSecs, currSession);
      currSession = breakUpdates.sessionStatus;
      totalSecs = breakUpdates.secs;
    }
  } else if (currSession === sessionStatus.BREAK) {
    if (totalSecs >= 0) {
      // if breaking and have remaining secs
      totalSecs = decreaseTime(totalSecs);
    } else {
      // if breaking and no remaining secs
      // updateClock(totalSecs);
      if (currWorkPeriod === totalPeriods) {
        finishSessions();
      } else {
        startUpdates = startWorkSession();
        currSession = startUpdates.sessionStatus;
        totalSecs = startUpdates.secs;
        currWorkPeriod = startUpdates.workPeriod;
      }
    }
  }
  showstatus(currSession, currWorkPeriod);
  updateClock(totalSecs);
}

/** Ask user to confirm action when click cancel
 * bind to an onclick actionl.
 */
function cancelAll() {
  timer.stop();
  const r = confirm("Are you sure you want to cancel the current session?");
  if (r) {
    clearAll();
  }
}

// On page load, get all session info
const taskName =
  localStorage.getItem("session_name") || "Default Pomodoro Session";
const {
  workInSec,
  sbreakInSec,
  lbreakInSec,
  workPeriods,
} = settings.getSettings();
let currDate = new Date();
let workDate = currDate.toLocaleDateString();
let workTime = currDate.toLocaleTimeString();

updateClock(workInSec);

// TODO: totalWork = work_incec etc.
let totalWork = parseInt(workInSec);
let totalBreak = parseInt(sbreakInSec);
let totalLongBreak = parseInt(lbreakInSec);
let totalPeriods = parseInt(workPeriods);

// 5 secs for quick end2end testing
//  totalWork = 5;
//  totalBreak = 5;
//  totalLongBreak = 10;
//totalPeriods = 1;

let intervalID;
let currSession = 0;
// 0 - no session
// 1 - working
// 2 - break
// 4 - pause from work
// 5 - pause from chill

let currWorkPeriod = 0;
let totalSecs = totalWork;
// totalSecs is whatever displays on the clock
