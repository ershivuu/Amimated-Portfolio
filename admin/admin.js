// -----------------BASE API URL---------------------
// const apiUrl = "http://192.168.29.96:5000";
const apiUrl = "http://192.168.29.192:5000";
// ------------------------------------------------

// ------------------------LOGIN & LOGOUT FUNCTIONALITY-----------------------------------

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginButton").addEventListener("click", login);
});

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "password") {
    window.location.href = "dashboard.html"; // Redirect to the new page
  } else {
    alert("Invalid username or password");
  }
}

// /-----------------END LOGIN & LOGOUT FUNCTIONALITY----------------------------------
//-------------------------DASHBOARD JS  ---------------------------------------------

document.getElementById("logoutButton").addEventListener("click", function () {
  window.location.href = "admin.html"; // Redirect back to the login page
});

// ------------------------DASHBOARD SIDEBAR JS --------------------------------------------------
var getSidebar = document.querySelector("nav");
var getToggle = document.getElementsByClassName("toggle");
for (var i = 0; i <= getToggle.length; i++) {
  getToggle[i].addEventListener("click", function () {
    getSidebar.classList.toggle("active");
  });
}

function loadPage(event, url) {
  event.preventDefault();
  document.getElementById("contentFrame").src = url;
}
// ---------------------------END DASHBOARD JS----------------------------------------------
