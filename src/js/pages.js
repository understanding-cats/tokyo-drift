function back2menu() {
  location.href = "home.html";
}

function goToPomo() {
  const sName = document.getElementById("sessionName").value;
  localStorage.setItem("session_name", sName);
  location.href = "pomodoro.html";
}
