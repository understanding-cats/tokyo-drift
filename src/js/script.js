const { remote, session } = require("electron");

const timer = require("../js/timer");
const { sessionStatusObj, storeSessionToFile } = require("../js/session");
const settings = require("../js/settings");
const utils = require("../js/utils");
const notification = require("../js/notification");

/**
 * Displays current session status on the HTML page.
 *
 * @param {Number} currStatus Current session status. This should match one of
 *                            the values in sessionStatusObj, imported above.
 *
 * @param {Number} periodNum Current period number.
 */
function showstatus(currStatus, periodNum) {
  document.getElementById("status").innerText = utils.getStatusMsg(
    currStatus,
    periodNum,
    totalPeriods
  );
}

/**
 * Displays remaining time in MM:SS format.
 *
 * @param {Number} secs Remaining seconds in current session.
 */
function updateClock(secs) {
  document.getElementById(
    "count_down"
  ).innerHTML = utils.secsToHumanReadableTime(secs);
}

/**
 * Reloads the current page.
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

/** pops notification when a task finishes.
 * Also pops a dialogue box to ask if user wants to go back to main menu.
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
    // pages.js isn't a module -- it's just a set of global functions, because
    // its functions are used as callbacks. So we just kind of call goToMenu()
    // directly. (Ideally we would set the HTML callbacks from within the JS
    // code, avoiding this problem.)
    goToMenu();
  } else {
    clearAll();
  }
}

/**
 * This function is called when session switches to "work session"
 * when called, it pops a notification and changes html styles.
 *
 * @param {number} workPeriod Current work period
 *
 * @return update workPeriod, currStatus, and secs
 */
function startWorkSession(workPeriod) {
  // switch to work
  notification.showNotification(
    notification.notificationKind.START_WORK_SESSION
  ); // show desktop notification for one session starts
  secs = totalWork;
  document.body.style.backgroundColor = "#F1DCDC";
  document.getElementById("tomato_img").src = "../images/tomato_tran.png";
  return {
    workPeriod: workPeriod + 1,
    currStatus: sessionStatusObj.WORKING,
    secs,
  };
}

/**
 * This function is called when session switches to "break session"
 * when called, it pops a notification and changes html styles.
 *
 * @param {number} secs Remaining seconds
 *
 * @return update workPeriod, currStatus, and secs
 */
function takeBreak(secs) {
  if (currWorkPeriod % 4 !== 0) {
    secs = totalBreak;
  } else {
    secs = totalLongBreak;
  }
  // switch to break mode
  notification.showNotification(
    notification.notificationKind.WORK_SESSION_DONE
  ); // show desktop notification for one session ends
  document.body.style.backgroundColor = "#D0E9F3";
  document.getElementById("tomato_img").src = "../images/tomatoblue_tran.png";
  return { secs, currStatus: sessionStatusObj.BREAK };
}
<<<<<<< HEAD

/**
 * This function is called every second by setInterval().
 *
 * It updates the clock and handles switching states when the current
 * session ends.
 *
 * As you can probably tell by the fact that this function accepts no
 * parameters, the behavior of this function is entirely dependent on global
 * variables. One way to get around this might be modifying this function to
 * take in some sort of state object as a paramter and act accordingly -- this
 * would simplify testing significantly.
 */
function showtime() {
  if (currSession === sessionStatusObj.WORKING) {
    if (totalSecs > 0) {
      totalSecs = decreaseTime(totalSecs);
=======
// Modified from https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js/36857101.
function writeToFile(jsonpath,taskDate,taskName,taskStart,workLength,breakLength,allPeriods){
  const fs = window.require('fs');
  const path = window.require('path');
  console.log("you are here");
  var jPath = path.join(__dirname,'..','json', jsonpath);
  console.log(jPath);
  fs.readFile(jPath, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
>>>>>>> 6784aa2 (Update src/js/script.js)
    } else {
      // working and remaining secs <= 0
      breakUpdates = takeBreak(totalSecs);
      currSession = breakUpdates.currStatus;
      totalSecs = breakUpdates.secs;
    }
  } else if (currSession === sessionStatusObj.BREAK) {
    if (totalSecs > 0) {
      // if breaking and have remaining secs
      totalSecs = decreaseTime(totalSecs);
    } else {
      // if breaking and no remaining secs
      // updateClock(totalSecs);
      if (currWorkPeriod === totalPeriods) {
        finishSessions();
      } else {
        startUpdates = startWorkSession(currWorkPeriod);
        currSession = startUpdates.currStatus;
        totalSecs = startUpdates.secs;
        currWorkPeriod = startUpdates.workPeriod;
      }
    }
  }
  showstatus(currSession, currWorkPeriod);
  updateClock(totalSecs);
}

/**
 * Stops the timer, and pops up a confirmation dialog for the user asking if
 * they would like to cancel the current session. If the user indicates they
 * would like to do so, this returns to the menu.
 */
function cancelAll() {
  timer.stop();
  const r = confirm("Are you sure you want to cancel the current session?");
  if (r) {
    goToMenu();
  }
}

// On page load, get all session info
<<<<<<< HEAD
const taskName =
  localStorage.getItem("session_name") || "Default Pomodoro Session";
const {
  workInSec,
  sbreakInSec,
  lbreakInSec,
  workPeriods,
} = settings.getSettings();
const currDateOnPageLoad = new Date();
let workDate = currDateOnPageLoad.toLocaleDateString();
let workTime = currDateOnPageLoad.toLocaleTimeString();

updateClock(workInSec);
=======
const taskName = localStorage.getItem("session_name") || "Default Pomodoro Session";
const workInSec = localStorage.getItem("work_ls") || 25 * 60;
const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
const workPeriods = localStorage.getItem("periods_ls") || 4;
let currDate = new Date();
let workDate = currDate.toLocaleDateString();
let workTime = currDate.toLocaleTimeString();

document.getElementById("currworktime").innerText = `Work Session: ${
  workInSec / 60
} mins`;
document.getElementById("currshortbreak").innerText = `Short Break: ${
  sbreakInSec / 60
} mins`;
document.getElementById("currlongbreak").innerText = `Long Break: ${
  lbreakInSec / 60
} mins`;
document.getElementById("currworkp").innerText = `Work Periods: ${workPeriods}`;

miniclock(workInSec);
>>>>>>> a0d4157 (Update src/js/script.js)

// TODO: totalWork = work_incec etc.
let totalWork = parseInt(workInSec, 10);
let totalBreak = parseInt(sbreakInSec, 10);
let totalLongBreak = parseInt(lbreakInSec, 10);
let totalPeriods = parseInt(workPeriods, 10);

// 5 secs for quick end2end testing
// totalWork = 5;
// totalBreak = 2;
// totalLongBreak = 10;
// totalPeriods = 2;

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
