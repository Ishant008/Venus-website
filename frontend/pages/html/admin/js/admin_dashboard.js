document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    // Call backend logout API
    await window.api.get("/auth/logout");

    // Clear stored token
    localStorage.removeItem("token");

    // Redirect back to login
    window.location.href = "/pages/html/login_page.html";
  } catch (err) {
    alert("Logout failed. Try again.");
  }
});
