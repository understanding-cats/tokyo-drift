if (typeof settings === "undefined") {
  settings = require("../js/settings");
}
const { loadSessionHistory } = require("../js/session");

function expand(btn) {
  var content = btn.nextElementSibling;
  if (content.style.display == "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}

function toggleMenu() {
  if (menu_open == 0) {
    openNav();
    menu_open = 1;
  } else {
    closeNav();
    menu_open = 0;
  }
}

function openNav() {
  document.getElementById("SideMenu").style.width = "250px";
  document.getElementById("hamburger").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("SideMenu").style.width = "0";
  document.getElementById("hamburger").style.marginLeft = "0";
}
function closeModal(modalID) {
  document.getElementById(modalID).style.display = "none";
}
function openModal(modalID) {
  document.getElementById(modalID).style.display = "block";
}

function loadMenu() {
  $("#SideMenu").load(
    "menu.html",
    function loadSessionModal(response, status, xhr) {
      $("#HistoryModal").load(
        "history_modal.html",
        function loadHistoryModal(response, status, xhr) {
          $("#SetSessionModal").load(
            "session_modal.html",
            function loadInfo(response, status, xhr) {
              settings.displayCurrentSettings();
              loadSessionHistory("../json/seshistory.json");
            }
          );
        }
      );
    }
  );
}

var menu_open = 0;
loadMenu();
