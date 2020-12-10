const { remote } = require("electron");
const { Notification }=remote;

//*** utility functions ***

function padzero(num) {
  var s = "00" + num;
  return s.substr(s.length - 2);
}
function showstatus(session_status,perio_num) {
  if (session_status == 0) {
    document.getElementById("status").innerText = "Pomodoro"+perio_num;
  }
  if (session_status == 1 || session_status == 4) {
    document.getElementById("status").innerText = "working..."+perio_num;
  }
  if (session_status == 2 || session_status == 5) {
    document.getElementById("status").innerText = "chilling..."+perio_num;
  }
}
function miniclock(secs) {
  var min = Math.floor(secs / 60);
  var sec = Math.floor(secs % 60);
  document.getElementById("count_down").innerHTML =
    padzero(min) + ":" + padzero(sec);
}

///***************************

function getsessioninfo(){
  //get and display latest setting on load 
  var work_insec = localStorage.getItem('work_ls') || 25*60;
  var sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
  var lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
  var work_periods = localStorage.getItem('periods_ls') || 4;
  document.getElementById("worktime").innerText = "Work Session: "+ work_insec/60 + " mins";
  document.getElementById("shortbreak").innerText = "Short Break: "+ sbreak_insec/60 + " mins";
  document.getElementById("longbreak").innerText = "Long Break: "+ lbreak_insec/60 + " mins";
  document.getElementById("workp").innerText = "Work Periods: "+ work_periods;
  document.getElementById("pomo_length").value = work_insec/60;
  document.getElementById("sbreak_length").value = sbreak_insec/60;
  document.getElementById("lbreak_length").value = lbreak_insec/60;
  document.getElementById("work_periods").value = work_periods;
}

// On page load, get all session info
var work_insec = localStorage.getItem('work_ls') || 25*60;
var sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
var lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
var work_periods = localStorage.getItem('periods_ls') || 4;

document.getElementById("currworktime").innerText = "Work Session: "+ work_insec/60 + " mins";
document.getElementById("currshortbreak").innerText = "Short Break: "+ sbreak_insec/60 + " mins";
document.getElementById("currlongbreak").innerText = "Long Break: "+ lbreak_insec/60 + " mins";
document.getElementById("currworkp").innerText = "Work Periods: "+ work_periods;

miniclock(work_insec);

//TODO: total_work = work_incec etc.
var total_work = work_insec;
var total_break = sbreak_insec;
var total_long_break = lbreak_insec;
var total_periods = work_periods;

//5 secs for quick end2end testing
total_work = 5;
total_break = 5;
total_long_break = 10;
total_periods = 5;

var intervalID;
var curr_session = 0;
// 0 - no session
// 1 - working
// 2 - break
// 4 - pause from work
// 5 - pause from chill

var curr_workperiod = 0;
var total_secs = total_work;
//total_secs is whatever displays on the clock

// Show desktop notifications: see https://www.electronjs.org/docs/tutorial/notifications.
function showNotification (notif_kind) {
  var msgText;
  if (notif_kind == 0){
    msgText = 'Congratulations! All sessions complete.';
  } else if (notif_kind == 1) {
    msgText = 'Completed one working session.';
  } else if (notif_kind == 2) {
    msgText = 'Starting one working session.';
  } else {
    throw new Error('Unrecognzied notification type.');
  }
  new Notification({
    title: 'Pomodoro 2: Tokyo Drift',
    body: msgText
  }).show();
}

// clock
function showtime() {
  if (curr_session == 1 && total_secs >= 0) {
    //working adn remaining secs >0
    total_secs = total_secs - 1;
    if(total_secs>=0){
      miniclock(total_secs);
    }
    showstatus(curr_session,curr_workperiod);
  }
  if (curr_session == 1 && total_secs < 0) {
    //working and remaining secs <= 0
    if(curr_workperiod%4!=0){
      total_secs = total_break;
    }else{
      total_secs = total_long_break;
    }
    //switch to break mode
    showNotification(1); // show desktop notification for one session ends
    curr_session = 2;
    document.body.style.backgroundColor = "#D0E9F3";
    document.getElementById("tomato_img").src = "../images/tomatoblue_tran.png";
    //miniclock(total_secs);
    showstatus(curr_session,curr_workperiod);
  }
  if (curr_session == 2 && total_secs >=0) {
    // if breaking and have remaining secs
    total_secs = total_secs - 1;
    if(total_secs>=0){
      miniclock(total_secs);
    }
    showstatus(curr_session,curr_workperiod);
  }
  if (curr_session == 2 && total_secs < 0) {
    // if breaking and no remaining secs
    //miniclock(total_secs);
    if (curr_workperiod == total_periods){
      clearInterval(intervalID);
      showNotification(0); // show desktop notification for all sessions end
      var r = confirm("Session complete! Go back to manu? ");
      if (r == true){
        location.href = "../home.html";
      }else{
        clear_all();
      }

    }else{
      curr_workperiod = curr_workperiod+1;
      //switch to work 
      showNotification(2); // show desktop notification for one session starts
      curr_session = 1;
      total_secs = total_work-1;
      document.body.style.backgroundColor = "#F1DCDC";
      document.getElementById("tomato_img").src = "../images/tomato_tran.png";
      miniclock(total_secs);
      showstatus(curr_session,curr_workperiod);
    }
  }
}
function start() {
  if ((curr_session == 0 || curr_session == 4) && total_secs >= 0) {
    if (curr_session ==0) {
      curr_workperiod = 1; 
    }
    curr_session = 1;
    //document.body.style.backgroundColor = "#F1DCDC";
    //document.getElementById("tomato_img").src = "tomato_tran.png";
    intervalID = setInterval(showtime, 1000);
  }
  if (curr_session == 5 && total_secs >= 0) {
    curr_session = 2;
    intervalID = setInterval(showtime, 1000);
  }
}
function stop() {
  if (curr_session == 0) {
    return;
  }
  if (curr_session == 1) {
    curr_session = 4;
  }
  if (curr_session == 2) {
    curr_session = 5;
  }

  clearInterval(intervalID);
  document.getElementById("status").innerHTML = "Pause";
}

function cancel_all() {
  stop();
  var r = confirm("Are you sure you want to cancel current session?");
  if (r == true){
    clear_all();
  }
  
};

function clear_all() {
  location.reload();
}
