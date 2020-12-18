/** Function that loads home page.
 */
function goToMenu() {
  location.href = "home.html";
}
/** Function that loads pomodoro page.
 */
function goToPomo() {
  const sName = document.getElementById("sessionName").value;
  localStorage.setItem("session_name", sName);
  location.href = "pomodoro.html";
}
