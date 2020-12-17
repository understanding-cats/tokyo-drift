const { remote, session } = require("electron");

const timer = require("../js/timer");
const { sessionStatus, storeSessionToFile } = require("../js/session");
const settings = require("../js/settings");
const notification = require("../js/notification");

//* ** utility functions ***

/** utility function that pads number with zeros at the front to make it 2 digits.
 * @param {number} num
 */
function padzero(num) {
  const s = `00${num}`;
  return s.substr(s.length - 2);
}

/** Displays current session status on html page
 * @param {object} sessionStatus - Object for current session status
 * @param {number} periodNum - current period number
 */
function showstatus(sessionStatus, periodNum) {
  if (sessionStatus === sessionStatus.NOSESSION) {
    document.getElementById("status").innerText = `Pomodoro${periodNum}`;
  }
  if (
    sessionStatus === sessionStatus.WORKING ||
    sessionStatus === sessionStatus.WORK_PAUSE
  ) {
    document.getElementById("status").innerText = `working...${periodNum}`;
  }
  if (
    sessionStatus === sessionStatus.BREAK ||
    sessionStatus === sessionStatus.CHILL_PAUSE
  ) {
    document.getElementById("status").innerText = `chilling...${periodNum}`;
  }
}

/** Displays remaining time in minutes:seconds
 * @param {number} secs - Remaining secs in current session
 */
function miniclock(secs) {
  if (secs < 0) {
    secs = 0;
  }
  const min = Math.floor(secs / 60);
  const sec = Math.floor(secs % 60);
  document.getElementById("count_down").innerHTML = `${padzero(min)}:${padzero(
    sec
  )}`;
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

/** a function called every second by setInterval()
 * switch states when current session ends
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
      // miniclock(totalSecs);
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
  miniclock(totalSecs);
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
// const workInSec = localStorage.getItem("work_ls") || 25 * 60;
// const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
// const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
// const workPeriods = localStorage.getItem("periods_ls") || 4;
let currDate = new Date();
let workDate = currDate.toLocaleDateString();
let workTime = currDate.toLocaleTimeString();

miniclock(workInSec);

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
