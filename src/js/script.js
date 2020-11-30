var total_work = 5;
var total_break = 5;
var total_secs = total_work;
var intervalID;
var curr_session = 0;
// 0 - no session
// 1 - working
// 2 - break
// 4 - pause from work
// 5 - pause from chill

//*** utility functions ***
function padzero(num) {
  var s = "00" + num;
  return s.substr(s.length - 2);
}
function showstatus() {
  if (curr_session == 0) {
    document.getElementById("status").innerHTML = "Pomodoro";
  }
  if (curr_session == 1 || curr_session == 4) {
    document.getElementById("status").innerHTML = "working...";
  }
  if (curr_session == 2 || curr_session == 5) {
    document.getElementById("status").innerHTML = "chilling...";
  }
}
function miniclock(secs) {
  var min = Math.floor(secs / 60);
  var sec = Math.floor(secs % 60);
  document.getElementById("count_down").innerHTML =
    padzero(min) + ":" + padzero(sec);
}

///***************************

// set session intervals

function getSession() {
  var countW = document.getElementById("work_ses").value;
  var countB = document.getElementById("break_ses").value;
  total_work = countW * 60;
  total_break = countB * 60;
  total_secs = total_work;
  miniclock(total_secs);
  clear_all();
}

// clock
function showtime() {
  if (curr_session == 1 && total_secs >= 0) {
    total_secs = total_secs - 1;
    miniclock(total_secs);
    showstatus();
  }
  if (curr_session == 1 && total_secs < 0) {
    total_secs = total_break;
    curr_session = 2;
    document.body.style.backgroundColor = "#D0E9F3";
    document.getElementById("tomato_img").src = "images/tomatoblue_tran.png";
    miniclock(total_secs);
    showstatus();
  }
  if (curr_session == 2 && total_secs >= 0) {
    total_secs = total_secs - 1;
    miniclock(total_secs);
    showstatus();
  }
  if (curr_session == 2 && total_secs < 0) {
    clear_all();
  }
}
function start() {
  if ((curr_session == 0 || curr_session == 4) && total_secs > 0) {
    curr_session = 1;
    //document.body.style.backgroundColor = "#F1DCDC";
    //document.getElementById("tomato_img").src = "tomato_tran.png";
    intervalID = setInterval(showtime, 1000);
  }
  if (curr_session == 5 && total_secs > 0) {
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

function clear_all() {
  curr_session = 0;
  document.body.style.backgroundColor = "#F1DCDC";
  document.getElementById("tomato_img").src = "images/tomato_tran.png";
  clearInterval(intervalID);
  document.getElementById("status").innerHTML = "pomodoro";
  total_secs = total_work;
  var min = Math.floor(total_secs / 60);
  var sec = Math.floor(total_secs % 60);
  document.getElementById("count_down").innerHTML =
    padzero(min) + ":" + padzero(sec);
}
