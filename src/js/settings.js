const utils = require("../js/utils");

/** This function fetches user settings from input value and store settings in localstorage.
 * @returns workInSec, sbreakInSec, lbreakInSec, workPeriods
 */
function setSettings() {
  const workInSec =
    60 * utils.validateNumInputs(document.getElementById("pomo_length").value);
  const sbreakInSec =
    60 *
    utils.validateNumInputs(document.getElementById("sbreak_length").value);
  const lbreakInSec =
    60 *
    utils.validateNumInputs(document.getElementById("lbreak_length").value);
  const workPeriods =
    1 * utils.validateNumInputs(document.getElementById("work_periods").value);
  localStorage.setItem("work_ls", workInSec);
  localStorage.setItem("sbreak_ls", sbreakInSec);
  localStorage.setItem("lbreak_ls", lbreakInSec);
  localStorage.setItem("periods_ls", workPeriods);
  document.getElementById("SetSessionModal").style.display = "none";
  displaySettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);
  displaySessionSettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);

  return {
    workInSec,
    sbreakInSec,
    lbreakInSec,
    workPeriods,
  };
}

/**
 * This function get settings from localstorage.
 *
 * If no prior settings exist, it uses default settings.
 *
 * As a TODO, we may want to add some explicit validation that the settings
 * retrieved (if any settings are retrieved) are sane.
 *
 * @returns workInSec, sbreakInSec, lbreakInSec, workPeriods
 */
function getSettings() {
  // TODO: Clean this up, because it looks scary
  const workInSec = localStorage.getItem("work_ls") || 25 * 60;
  const sbreakInSec = localStorage.getItem("sbreak_ls") || 5 * 60;
  const lbreakInSec = localStorage.getItem("lbreak_ls") || 15 * 60;
  const workPeriods = localStorage.getItem("periods_ls") || 4;

  // check if the element has been loaded
  if (document.getElementById("worktime")) {
    displaySessionSettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);
  }
  if (document.getElementById("pomo_length")) {
    displaySettings(workInSec, sbreakInSec, lbreakInSec, workPeriods);
  }
  return {
    workInSec: parseInt(workInSec, 10),
    sbreakInSec: parseInt(sbreakInSec, 10),
    lbreakInSec: parseInt(lbreakInSec, 10),
    workPeriods: parseInt(workPeriods, 10),
  };
}
/** This function display current settings as place holders in input box.
 * @param {number} workInSec
 * @param {number} sbreakInSec
 * @param {number} lbreakInSec
 * @param {number} workPeriods
 */
function displaySettings(workInSec, sbreakInSec, lbreakInSec, workPeriods) {
  document.getElementById("pomo_length").value = utils.secsToMins(workInSec);
  document.getElementById("sbreak_length").value = utils.secsToMins(
    sbreakInSec
  );
  document.getElementById("lbreak_length").value = utils.secsToMins(
    lbreakInSec
  );
  document.getElementById("work_periods").value = workPeriods;
}

/** This function display current session settings in side menu.
 * @param {number} workInSec
 * @param {number} sbreakInSec
 * @param {number} lbreakInSec
 * @param {number} workPeriods
 */
function displaySessionSettings(
  workInSec,
  sbreakInSec,
  lbreakInSec,
  workPeriods
) {
  document.getElementById("worktime").innerText = utils.secsToMins(
    workInSec,
    true
  );
  document.getElementById("shortbreak").innerText = utils.secsToMins(
    sbreakInSec,
    true
  );
  document.getElementById("longbreak").innerText = utils.secsToMins(
    lbreakInSec,
    true
  );
  document.getElementById("workp").innerText = `${workPeriods}`;
}
/** This function display most recent settings in side menu.
 * i.e next session info.
 */
function displayCurrentSettings() {
  const { workInSec, sbreakInSec, lbreakInSec, workPeriods } = getSettings();
  document.getElementById("currworktime").innerText = utils.secsToMins(
    workInSec,
    true
  );
  document.getElementById("currshortbreak").innerText = utils.secsToMins(
    sbreakInSec,
    true
  );
  document.getElementById("currlongbreak").innerText = utils.secsToMins(
    lbreakInSec,
    true
  );
  document.getElementById("currworkp").innerText = `${workPeriods}`;
}

module.exports = { setSettings, getSettings, displayCurrentSettings };
