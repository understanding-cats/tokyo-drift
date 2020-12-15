const { remote } = require("electron");

const { Notification } = remote;

//* ** utility functions ***

function padzero(num) {
  const s = `00${num}`;
  return s.substr(s.length - 2);
}
function showstatus(sessionStatus, periodNum) {
  if (sessionStatus === 0) {
    document.getElementById("status").innerText = `Pomodoro${periodNum}`;
  }
  if (sessionStatus === 1 || sessionStatus === 4) {
    document.getElementById("status").innerText = `working...${periodNum}`;
  }
  if (sessionStatus === 2 || sessionStatus === 5) {
    document.getElementById("status").innerText = `chilling...${periodNum}`;
  }
}
function miniclock(secs) {
  const min = Math.floor(secs / 60);
  const sec = Math.floor(secs % 60);
  document.getElementById("count_down").innerHTML = `${padzero(min)}:${padzero(
    sec
  )}`;
}
// Modified from https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js/36857101.
function writeToFile(jsonpath,taskDate,taskName,taskStart,workLength,breakLength,allPeriods){
  const fs = window.require('fs');
  const path = window.require('path');
  var jPath = path.join(__dirname,'..','json', jsonpath);
  fs.readFile(jPath, 'utf8', function readFileCallback(err, data){
    if (err){
        throw err;
    } else {
      obj = JSON.parse(data); 
      n_record = {
        date: taskDate,
        task: taskName,
        start: taskStart,
        wlength: workLength,
        blength: breakLength,
        periods: allPeriods
      }
      obj.records.push(n_record);
      json = JSON.stringify(obj,null,4);
      fs.writeFileSync(jPath, json); // write it back 
    }});
}

/// ***************************

function getsessioninfo() {
  // get and display latest setting on load
  const workInSec = localStorage.getItem("work_ls") || 25 * 60;
  const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
  const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
  const workPeriods = localStorage.getItem("periods_ls") || 4;
  document.getElementById("worktime").innerText = `Work Session: ${
    workInSec / 60
  } mins`;
  document.getElementById("shortbreak").innerText = `Short Break: ${
    sbreakInSec / 60
  } mins`;
  document.getElementById("longbreak").innerText = `Long Break: ${
    lbreakInSec / 60
  } mins`;
  document.getElementById("workp").innerText = `Work Periods: ${workPeriods}`;
  document.getElementById("pomo_length").value = workInSec / 60;
  document.getElementById("sbreak_length").value = sbreakInSec / 60;
  document.getElementById("lbreak_length").value = lbreakInSec / 60;
  document.getElementById("work_periods").value = workPeriods;
}

// On page load, get all session info
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

// Show desktop notifications: see https://www.electronjs.org/docs/tutorial/notifications.
function showNotification(notifKind) {
  let msgText;
  if (notifKind === 0) {
    msgText = "Congratulations! All sessions complete.";
  } else if (notifKind === 1) {
    msgText = "Completed one working session.";
  } else if (notifKind === 2) {
    msgText = "Starting one working session.";
  } else {
    throw new Error("Unrecognzied notification type.");
  }
  new Notification({
    title: "Pomodoro 2: Tokyo Drift",
    body: msgText,
  }).show();
}

function clearAll() {
  location.reload();
}

// clock
function showtime() {
  if (currSession === 1 && totalSecs >= 0) {
    // working and remaining secs >0
    totalSecs--;
    if (totalSecs >= 0) {
      miniclock(totalSecs);
    }
    showstatus(currSession, currWorkPeriod);
  }
  if (currSession === 1 && totalSecs < 0) {
    // working and remaining secs <= 0
    if (currWorkPeriod % 4 !== 0) {
      totalSecs = totalBreak;
    } else {
      totalSecs = totalLongBreak;
    }
    // switch to break mode
    showNotification(1); // show desktop notification for one session ends
    currSession = 2;
    document.body.style.backgroundColor = "#D0E9F3";
    document.getElementById("tomato_img").src = "../images/tomatoblue_tran.png";
    // miniclock(totalSecs);
    showstatus(currSession, currWorkPeriod);
  }
  if (currSession === 2 && totalSecs >= 0) {
    // if breaking and have remaining secs
    totalSecs -= 1;
    if (totalSecs >= 0) {
      miniclock(totalSecs);
    }
    showstatus(currSession, currWorkPeriod);
  }
  if (currSession === 2 && totalSecs < 0) {
    // if breaking and no remaining secs
    // miniclock(totalSecs);
    if (currWorkPeriod === totalPeriods) {
      clearInterval(intervalID);
      writeToFile("seshistory.json",workDate,taskName,workTime,workInSec,sbreakInSec,workPeriods);
      showNotification(0); // show desktop notification for all sessions end
      const r = confirm("Sessions complete! Go back to menu?");
      if (r) {
        location.href = "../home.html";
      } else {
        clearAll();
      }
    } else {
      currWorkPeriod += 1;
      // switch to work
      showNotification(2); // show desktop notification for one session starts
      currSession = 1;
      totalSecs = totalWork - 1;
      document.body.style.backgroundColor = "#F1DCDC";
      document.getElementById("tomato_img").src = "../images/tomato_tran.png";
      miniclock(totalSecs);
      showstatus(currSession, currWorkPeriod);
    }
  }
}
function start() {
  if ((currSession === 0 || currSession === 4) && totalSecs >= 0) {
    if (currSession === 0) {
      currDate = new Date();
      workDate = currDate.toLocaleDateString();
      workTime = currDate.toLocaleTimeString();
      currWorkPeriod = 1;
    }
    currSession = 1;
    // document.body.style.backgroundColor = "#F1DCDC";
    // document.getElementById("tomato_img").src = "tomato_tran.png";
    intervalID = setInterval(showtime, 1000);
  }
  if (currSession === 5 && totalSecs >= 0) {
    currSession = 2;
    intervalID = setInterval(showtime, 1000);
  }
}
function stop() {
  if (currSession === 0) {
    return;
  }
  if (currSession === 1) {
    currSession = 4;
  }
  if (currSession === 2) {
    currSession = 5;
  }

  clearInterval(intervalID);
  document.getElementById("status").innerHTML = "Pause";
}

function cancelAll() {
  stop();
  const r = confirm("Are you sure you want to cancel the current session?");
  if (r) {
    clearAll();
  }
}
