"use strict";
function loadHistory(path) {
  let jsonData = require(path);
  let allrecords = jsonData.records;
  //document.getElementById("dummyBtn").innerHTML = jsonData.records[0].task;

  for (let r of allrecords) {
    var start_date = new Date(r.date);

    //var itmbtn = document.getElementById("dummyBtn");
    var clnbtn = document.getElementById("dummyBtn").cloneNode(true);
    clnbtn.removeAttribute("ID");
    clnbtn.innerText = start_date.toDateString();
    //var itmctn = document.getElementById("dummyContent");
    var clnctn = document.getElementById("dummyContent").cloneNode(true);
    clnctn.removeAttribute("ID");
    clnctn.innerText = "";

    var task_name = document.createElement("P");
    task_name.innerText = "Task: " + r.task;
    var start_time = document.createElement("P");
    start_time.innerText = "Started work at " + r.start;
    var work_len = document.createElement("P");
    work_len.innerText =
      r.periods + " work periods of length " + r.wlength / 60 + " minutes";
    var break_len = document.createElement("P");
    break_len.innerText = "separated by " + r.blength / 60 + "-minute breaks.";
    clnctn.appendChild(task_name);
    clnctn.appendChild(start_time);
    clnctn.appendChild(work_len);
    clnctn.appendChild(break_len);

    document.getElementById("HistoryModalContent").appendChild(clnbtn);
    document.getElementById("HistoryModalContent").appendChild(clnctn);
  }
}
