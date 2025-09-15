const api = axios.create({
  baseURL: "http://localhost:5000/api", // 🔹 change to your backend URL
  withCredentials: true,                // allow sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Expose globally so other scripts can use it
window.api = api;