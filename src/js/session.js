const sessionStatusObj = {
  NOSESSION: 0,
  WORKING: 1,
  BREAK: 2,
  WORK_PAUSE: 4,
  CHILL_PAUSE: 5,
};

function loadSessionHistory(path) {
  const jsonData = require(path);

  for (const record of jsonData.records) {
    const startDate = new Date(record.date);
    displaySessionRecord(startDate.toDateString(), record);
  }
}

/** This function stores pomodoro session history in persistent data.
 * Modified from https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js/36857101.
 * @param {string} jsonpath - path to json file
 * @param {string} taskDate - date of task
 * @param {string} taskName - name of task
 * @param {string} taskStart - starting time of task
 * @param {number} workLength - length of work session
 * @param {number} breakLength - length of break session
 * @param {number} allPeriods - total number of work periods.
 */
function storeSessionToFile(
  jsonpath,
  taskDate,
  taskName,
  taskStart,
  workLength,
  breakLength,
  allPeriods
) {
  const fs = window.require("fs");
  const path = window.require("path");
  const jPath = path.join(__dirname, "..", "..", "json", jsonpath);
  fs.readFile(jPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      throw err;
    } else {
      obj = JSON.parse(data);
      nRecord = {
        date: taskDate,
        task: taskName,
        start: taskStart,
        wlength: workLength,
        blength: breakLength,
        periods: allPeriods,
      };
      obj.records.push(nRecord);
      json = JSON.stringify(obj, null, 4);
      fs.writeFileSync(jPath, json); // write it back
    }
  });
}

/** This function displays session records on html page.
 * It creates a new element for each record
 * @param {string} startDate - date of task
 * @param {object} record - task record object
 */
function displaySessionRecord(startDate, record) {
  const clnbtn = document.getElementById("dummyBtn").cloneNode(true);
  clnbtn.removeAttribute("ID");
  clnbtn.innerText = startDate;
  const clnctn = document.getElementById("dummyContent").cloneNode(true);
  clnctn.removeAttribute("ID");
  clnctn.innerText = "";

  const taskName = document.createElement("P");
  taskName.innerText = `Task: ${record.task}`;
  const startTime = document.createElement("P");
  startTime.innerText = `Started work at ${record.start}`;
  const workLen = document.createElement("P");
  workLen.innerText = `${record.periods} work periods of length ${
    record.wlength / 60
  } minutes`;
  const breakLen = document.createElement("P");
  breakLen.innerText = `separated by ${record.blength / 60}-minute breaks.`;
  clnctn.appendChild(taskName);
  clnctn.appendChild(startTime);
  clnctn.appendChild(workLen);
  clnctn.appendChild(breakLen);
  document.getElementById("HistoryModalContent").appendChild(clnbtn);
  document.getElementById("HistoryModalContent").appendChild(clnctn);
}

module.exports = { sessionStatusObj, loadSessionHistory, storeSessionToFile };
