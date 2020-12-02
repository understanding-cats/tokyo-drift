
function back2manu(){
    location.href = "../home.html";

};
function getsettings(){
    var work_insec = localStorage.getItem('work_ls') || 25*60;
    var sbreak_insec = localStorage.getItem('sbreak_ls') || 5*60;
    var lbreak_insec = localStorage.getItem('lbreak_ls') || 15*60;
    var work_periods = localStorage.getItem('periods_ls') || 4;
    document.getElementById("pomo_length").value = work_insec/60;
    document.getElementById("sbreak_length").value = sbreak_insec/60;
    document.getElementById("lbreak_length").value = lbreak_insec/60;
    document.getElementById("work_periods").value = work_periods;

};

function startsess(){
    if (typeof(Storage) !== "undefined") {
        // Store
        var work_insec =   60*document.getElementById("pomo_length").value
        var sbreak_insec = 60*document.getElementById("sbreak_length").value
        var lbreak_insec = 60*document.getElementById("lbreak_length").value
        var work_periods = document.getElementById("work_periods").value 
        localStorage.setItem('work_ls', work_insec);
        localStorage.setItem('sbreak_ls', sbreak_insec);
        localStorage.setItem('lbreak_ls', lbreak_insec);
        localStorage.setItem('periods_ls', work_periods);
        // Retrieve
        //document.getElementById("result").innerHTML = localStorage.getItem("work_ls");
        location.href = "pomodoro.html";
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }
};