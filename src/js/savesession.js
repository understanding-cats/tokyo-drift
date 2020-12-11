function loadHistory(path) {
  const jsonData = require(path);

  for (let recordIdx = 0; recordIdx < jsonData.records.length; recordIdx++) {
    const r = jsonData.records[recordIdx];
    const startDate = new Date(r.date);

    // var itmbtn = document.getElementById("dummyBtn");
    const clnbtn = document.getElementById("dummyBtn").cloneNode(true);
    clnbtn.removeAttribute("ID");
    clnbtn.innerText = startDate.toDateString();
    // var itmctn = document.getElementById("dummyContent");
    const clnctn = document.getElementById("dummyContent").cloneNode(true);
    clnctn.removeAttribute("ID");
    clnctn.innerText = "";

    const taskName = document.createElement("P");
    taskName.innerText = `Task: ${r.task}`;
    const startTime = document.createElement("P");
    startTime.innerText = `Started work at ${r.start}`;
    const workLen = document.createElement("P");
    workLen.innerText = `${r.periods} work periods of length ${
      r.wlength / 60
    } minutes`;
    const breakLen = document.createElement("P");
    breakLen.innerText = `separated by ${r.blength / 60}-minute breaks.`;
    clnctn.appendChild(taskName);
    clnctn.appendChild(startTime);
    clnctn.appendChild(workLen);
    clnctn.appendChild(breakLen);

    document.getElementById("HistoryModalContent").appendChild(clnbtn);
    document.getElementById("HistoryModalContent").appendChild(clnctn);
  }
}
