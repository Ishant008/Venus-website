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