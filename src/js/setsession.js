function back2menu() {
  location.href = "../home.html";
}

function goToPomo() {
  location.href = "html/pomodoro.html";
}

function displaySessionInfo() {
  const workInSec = localStorage.getItem("work_ls") || 25 * 60;
  const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
  const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
  const workPeriods = localStorage.getItem("periods_ls") || 4;
  document.getElementById("worktime").innerText = `Work Session: ${
    workInSec / 60
  }mins`;
  document.getElementById("shortbreak").innerText = `Short Break: ${
    sbreakInSec / 60
  }mins`;
  document.getElementById("longbreak").innerText = `Long Break: ${
    lbreakInSec / 60
  }mins`;
  document.getElementById("workp").innerText = `Work Periods: ${workPeriods}`;
}

function getsettings() {
  const workInSec = localStorage.getItem("work_ls") || 25 * 60;
  const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
  const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
  const workPeriods = localStorage.getItem("periods_ls") || 4;
  document.getElementById("pomo_length").value = workInSec / 60;
  document.getElementById("sbreak_length").value = sbreakInSec / 60;
  document.getElementById("lbreak_length").value = lbreakInSec / 60;
  document.getElementById("work_periods").value = workPeriods;
  displaySessionInfo();
}

/**
 * This method based on w3schools' documentation, e.g.
 * https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webstorage_local
 */
function startsess() {
  if (typeof Storage !== "undefined") {
    const workInSec = 60 * document.getElementById("pomo_length").value;
    const sbreakInSec = 60 * document.getElementById("sbreak_length").value;
    const lbreakInSec = 60 * document.getElementById("lbreak_length").value;
    const workPeriods = document.getElementById("work_periods").value;
    localStorage.setItem("work_ls", workInSec);
    localStorage.setItem("sbreak_ls", sbreakInSec);
    localStorage.setItem("lbreak_ls", lbreakInSec);
    localStorage.setItem("periods_ls", workPeriods);
    document.getElementById("SetSessionModal").style.display = "none";
    displaySessionInfo();
  } else {
    document.getElementById("result").innerHTML =
      "Sorry, your browser does not support Web Storage";
  }
}
