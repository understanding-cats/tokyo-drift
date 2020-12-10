function loadHistory(path) {
  const jsonData = require(path);
  const allrecords = jsonData.records;
  // document.getElementById("dummyBtn").innerHTML = jsonData.records[0].task;

  for (const r of allrecords) {
    const start_date = new Date(r.date);

    // var itmbtn = document.getElementById("dummyBtn");
    const clnbtn = document.getElementById('dummyBtn').cloneNode(true);
    clnbtn.removeAttribute('ID');
    clnbtn.innerText = start_date.toDateString();
    // var itmctn = document.getElementById("dummyContent");
    const clnctn = document.getElementById('dummyContent').cloneNode(true);
    clnctn.removeAttribute('ID');
    clnctn.innerText = '';

    const task_name = document.createElement('P');
    task_name.innerText = `Task: ${r.task}`;
    const start_time = document.createElement('P');
    start_time.innerText = `Started work at ${r.start}`;
    const work_len = document.createElement('P');
    work_len.innerText = `${r.periods} work periods of length ${r.wlength / 60} minutes`;
    const break_len = document.createElement('P');
    break_len.innerText = `separated by ${r.blength / 60}-minute breaks.`;
    clnctn.appendChild(task_name);
    clnctn.appendChild(start_time);
    clnctn.appendChild(work_len);
    clnctn.appendChild(break_len);

    document.getElementById('HistoryModalContent').appendChild(clnbtn);
    document.getElementById('HistoryModalContent').appendChild(clnctn);
  }
}