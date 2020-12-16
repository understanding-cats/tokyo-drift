function setSettings() {
  const workInSec = 60 * document.getElementById("pomo_length").value;
  const sbreakInSec = 60 * document.getElementById("sbreak_length").value;
  const lbreakInSec = 60 * document.getElementById("lbreak_length").value;
  const workPeriods = 1 * document.getElementById("work_periods").value;
  localStorage.setItem("work_ls", workInSec);
  localStorage.setItem("sbreak_ls", sbreakInSec);
  localStorage.setItem("lbreak_ls", lbreakInSec);
  localStorage.setItem("periods_ls", workPeriods);
  document.getElementById("SetSessionModal").style.display = "none";
  displaySettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);
  displaySessionSettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);

  return {
    workInSec: workInSec,
    sbreakInSec: sbreakInSec,
    lbreakInSec: lbreakInSec,
    workPeriods: workPeriods,
  };
}

function getSettings() {
  const workInSec = localStorage.getItem("work_ls") || 25 * 60;
  const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
  const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
  const workPeriods = localStorage.getItem("periods_ls") || 4;

  // check if the element has been load
  if (document.getElementById("worktime")) {
    displaySessionSettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);
  }
  if (document.getElementById("pomo_length")) {
    displaySettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);
  }
  return {
    workInSec: workInSec,
    sbreakInSec: sbreakInSec,
    lbreakInSec: lbreakInSec,
    workPeriods: workPeriods,
  };
}

function displaySettings(workInSec, sbreakInSec, lbreakInSec, workPeriods) {
  document.getElementById("pomo_length").value = workInSec / 60;
  document.getElementById("sbreak_length").value = sbreakInSec / 60;
  document.getElementById("lbreak_length").value = lbreakInSec / 60;
  document.getElementById("work_periods").value = workPeriods;
}

function displaySessionSettings(
  workInSec,
  sbreakInSec,
  lbreakInSec,
  workPeriods
) {
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

function displayCurrentSettings() {
  const { workInSec, sbreakInSec, lbreakInSec, workPeriods } = getSettings();
  document.getElementById("currworktime").innerText = `Work Session: ${
    workInSec / 60
  } mins`;
  document.getElementById("currshortbreak").innerText = `Short Break: ${
    sbreakInSec / 60
  } mins`;
  document.getElementById("currlongbreak").innerText = `Long Break: ${
    lbreakInSec / 60
  } mins`;
  document.getElementById(
    "currworkp"
  ).innerText = `Work Periods: ${workPeriods}`;
}

module.exports = { setSettings, getSettings, displayCurrentSettings };
