const { remote } = require("electron");
const { Notification }=remote;
//*** utility functions ***
function back2manu(){
  location.href = "../home.html";
};
function padzero(num) {
  var s = "00" + num;
  return s.substr(s.length - 2);
}
function showstatus(session_status,perio_num) {
  if (session_status == 0) {
    document.getElementById("status").innerHTML = "Pomodoro"+perio_num;
  }
  if (session_status == 1 || session_status == 4) {
    document.getElementById("status").innerHTML = "working..."+perio_num;
  }
  if (session_status == 2 || session_status == 5) {
    document.getElementById("status").innerHTML = "chilling..."+perio_num;
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
  work_insec = localStorage.getItem('work_ls') || 25*60;
  sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
  lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
  work_periods = localStorage.getItem('periods_ls') || 4;
  document.getElementById("work_time").innerHTML = "Each work session:"+ localStorage.getItem('work_ls')/60 + "minutes";
  document.getElementById("short_breaktime").innerHTML = "Each short break:"+localStorage.getItem('sbreak_ls')/60+ "minutes";
  document.getElementById("long_breaktime").innerHTML = "Each long break:"+localStorage.getItem('lbreak_ls')/60+ "minutes";
  document.getElementById("total_periods").innerHTML = "Total work periods:"+ localStorage.getItem('periods_ls');
  miniclock(work_insec);
}

var work_insec = localStorage.getItem('work_ls') || 25*60;
var sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
var lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
var work_periods = localStorage.getItem('periods_ls') || 4;


//TODO: total_work = work_incec etc.
var total_work = work_insec;
var total_break = sbreak_insec;
var total_long_break = lbreak_insec;
var total_periods = work_periods;

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

// notification
function showNotification () {
  new Notification({title: 'Pomodoro Session',
    body: 'Congratulations! One session completes.'}).show();
}

// clock
function showtime() {
  if (curr_session == 1 && total_secs >= 0) {
    //working adn remaining secs >0
    total_secs = total_secs - 1;
    miniclock(total_secs);
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
    curr_session = 2;
    document.body.style.backgroundColor = "#D0E9F3";
    document.getElementById("tomato_img").src = "../images/tomatoblue_tran.png";
    miniclock(total_secs);
    showstatus(curr_session,curr_workperiod);
  }
  if (curr_session == 2 && total_secs >=0) {
    // if breaking and have remaining secs
    total_secs = total_secs - 1;
    miniclock(total_secs);
    showstatus(curr_session,curr_workperiod);
  }
  if (curr_session == 2 && total_secs < 0) {
    // if breaking and no remaining secs
    if (curr_workperiod == total_periods){
      showNotification(); // show desktop notification
      var r = confirm("Session complete! Go back to manu? ");
      if (r == true){
        location.href = "../home.html";
      }
      clear_all();

    }else{
      curr_workperiod = curr_workperiod+1;
      //switch to work 
      curr_session = 1;
      total_secs = total_work;
      document.body.style.backgroundColor = "#F1DCDC";
      document.getElementById("tomato_img").src = "../images/tomato_tran.png";
      miniclock(total_secs);
      showstatus(curr_session,curr_workperiod);
    }
  }
}
function start() {
  if ((curr_session == 0 || curr_session == 4) && total_secs > 0) {
    if (curr_session ==0) {
      curr_workperiod = 1; 
    }
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
  getsessioninfo();
  curr_session = 0;
  curr_workperiod = 0;

  document.body.style.backgroundColor = "#F1DCDC";
  document.getElementById("tomato_img").src = "../images/tomato_tran.png";
  clearInterval(intervalID);
  // TODO don't duplicate this text between the HTML and here
  document.getElementById("status").innerHTML = "Press the start button to begin working.";
  total_secs = total_work;
  miniclock(total_secs);
}


// function doConfirm(msg, yesFn, noFn) {
//   var confirmBox = $("#confirmBox");
//   confirmBox.find(".message").text(msg);
//   confirmBox.find(".yes,.no").unbind().click(function () {
//       confirmBox.hide();
//   });
//   confirmBox.find(".yes").click(yesFn);
//   confirmBox.find(".no").click(noFn);
//   confirmBox.show();
// }