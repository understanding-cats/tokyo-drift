const { Notification } = remote;

const notificationKind = {
  SESSIONS_COMPLETE: 0,
  WORK_SESSION_DONE: 1,
  START_WORK_SESSION: 2,
};

function showNotification(notification) {
  let msgText;
  if (notification === notificationKind.SESSIONS_COMPLETE) {
    msgText = "Congratulations! All sessions complete.";
  } else if (notification === notificationKind.WORK_SESSION_DONE) {
    msgText = "Completed one working session.";
  } else if (notification === notificationKind.START_WORK_SESSION) {
    msgText = "Starting one working session.";
  } else {
    throw new Error("Unrecognzied notification type.");
  }
  new Notification({
    title: "Pomodoro 2: Tokyo Drift",
    body: msgText,
  }).show();
}

module.exports = { notificationKind, showNotification };
