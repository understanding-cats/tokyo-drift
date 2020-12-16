function start() {
  if ((currSession === 0 || currSession === 4) && totalSecs >= 0) {
    if (currSession === 0) {
      currDate = new Date();
      workDate = currDate.toLocaleDateString();
      workTime = currDate.toLocaleTimeString();
      currWorkPeriod = 1;
    }
    currSession = 1;
    // document.body.style.backgroundColor = "#F1DCDC";
    // document.getElementById("tomato_img").src = "tomato_tran.png";
    intervalID = setInterval(showtime, 1000);
  }
  if (currSession === 5 && totalSecs >= 0) {
    currSession = 2;
    intervalID = setInterval(showtime, 1000);
  }
}

function stop() {
  if (currSession === 0) {
    return;
  }
  if (currSession === 1) {
    currSession = 4;
  }
  if (currSession === 2) {
    currSession = 5;
  }

  clearInterval(intervalID);
  document.getElementById("status").innerHTML = "Pause";
}

module.exports = { start, stop };
