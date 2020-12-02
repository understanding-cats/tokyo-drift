// Require ipcRender
const { ipcRenderer } = require("electron");

let timerBox = document.getElementById("timerBox");

const setTimer = () => {
  timerBox.innerHTML =
    timeObject.hours + ":" + timeObject.minutes + ":" + timeObject.seconds;
};

const emptyTimer = () => {
  return (
    timeObject.hours == 0 && timeObject.minutes == 0 && timeObject.seconds == 0
  );
};

const initTime = () => {
  timeObject.hours = 0;
  timeObject.minutes = 0;
  timeObject.seconds = 5;
};

var timeObject = {
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const passOneSecond = () => {
  if (timeObject.seconds == 0) {
    timeObject.seconds = 59;
    if (timeObject.minutes == 0) {
      timeObject.minutes = 59;
      timeObject.hours--;
    } else {
      timeObject.minutes--;
    }
  } else {
    timeObject.seconds--;
  }
};

// Listen to the 'timer-change' event
ipcRenderer.on("timer-change", (event, t) => {
  initTime();
  setTimer();

  // Execute every second
  let timerIntervalId = setInterval(() => {
    passOneSecond();
    setTimer();
    if (emptyTimer()) {
      clearInterval(timerIntervalId);
    }
  }, 1000); // 1 second
});
