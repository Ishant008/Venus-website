const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");

  togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassword.textContent = "visibility";  // 👁 show icon
    } else {
      passwordInput.type = "password";
      togglePassword.textContent = "visibility_off"; // 🚫 hide icon
    }
  });



const loginBtn = document.getElementById("loginBtn");
const loginText = document.getElementById("loginText");
const loginLoader = document.getElementById("loginLoader");

loginBtn.addEventListener("click", async () => {
  const username = document.querySelector("input[placeholder='Username']").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  try {
    // 🔹 Show loader & disable button
    loginBtn.disabled = true;
    loginText.classList.add("hidden");
    loginLoader.classList.remove("hidden");

    const res = await window.api.post("/auth/login", { username, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      window.location.href = "/pages/html/admin/admin_dashboard.html";
    }
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  } finally {
    // 🔹 Hide loader & re-enable button (only if not redirected yet)
    loginBtn.disabled = false;
    loginText.classList.remove("hidden");
    loginLoader.classList.add("hidden");
  }
});

