'use strict';



//console.log(jsonData);


//JSON.parse(rawdata)

//{"date":"2020.10.11","task":"pomodoro test","start":"12-13","wlength":300,"blength":60,"periods":4}
/* <p>Task: "Putting together a pitch for CSE 210"</p>
<p>Started work at 12:30 AM.</p>
<p>4 work periods of length 25 minutes</p>
<p>separated by 5-minute breaks.</p>   */
function loadHistory(path){

    let jsonData = require(path);
    let allrecords = jsonData.records;
    //document.getElementById("dummyBtn").innerHTML = jsonData.records[0].task;
    
    for (let r of allrecords){
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
        task_name.innerText ="Task: " + r.task;
        var start_time = document.createElement("P");
        start_time.innerText = "Started work at "+ r.start;
        var work_len = document.createElement("P");
        work_len.innerText = r.periods + " work periods of length " + r.wlength/60 + " minutes";
        var break_len = document.createElement("P");
        break_len.innerText = "separated by " + r.blength/60 + "-minute breaks."
        clnctn.appendChild(task_name);
        clnctn.appendChild(start_time);
        clnctn.appendChild(work_len);
        clnctn.appendChild(break_len);

        document.getElementById("HistoryModalContent").appendChild(clnbtn);
        document.getElementById("HistoryModalContent").appendChild(clnctn);
    }

};