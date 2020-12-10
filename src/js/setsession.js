
function back2manu(){
    location.href = "../home.html";

};
function goToPomo(){
    location.href = "html/pomodoro.html";

}
function getsettings(){
    var work_insec = localStorage.getItem('work_ls') || 25*60;
    var sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
    var lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
    var work_periods = localStorage.getItem('periods_ls') || 4;
    document.getElementById("pomo_length").value = work_insec/60;
    document.getElementById("sbreak_length").value = sbreak_insec/60;
    document.getElementById("lbreak_length").value = lbreak_insec/60;
    document.getElementById("work_periods").value = work_periods;
    displaySessionInfo();

};

function displaySessionInfo(){
    var work_insec = localStorage.getItem('work_ls') || 25*60;
    var sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
    var lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
    var work_periods = localStorage.getItem('periods_ls') || 4;
    document.getElementById("worktime").innerText = "Work Session: "+ work_insec/60 + "mins";
    document.getElementById("shortbreak").innerText = "Short Break: "+ sbreak_insec/60 + "mins";
    document.getElementById("longbreak").innerText = "Long Break: "+ lbreak_insec/60 + "mins";
    document.getElementById("workp").innerText = "Work Periods: "+ work_periods;

};

/**
  * This method based on w3schools' documentation, e.g.
  * https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webstorage_local
  */
function startsess(){
    if (typeof(Storage) !== "undefined") {
        var work_insec =   60*document.getElementById("pomo_length").value
        var sbreak_insec = 60*document.getElementById("sbreak_length").value
        var lbreak_insec = 60*document.getElementById("lbreak_length").value
        var work_periods = document.getElementById("work_periods").value 
        localStorage.setItem('work_ls', work_insec);
        localStorage.setItem('sbreak_ls', sbreak_insec);
        localStorage.setItem('lbreak_ls', lbreak_insec);
        localStorage.setItem('periods_ls', work_periods);
        document.getElementById("SetSessionModal").style.display = "none";
        displaySessionInfo();
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage";
      }
};
