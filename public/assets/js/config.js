window.CONFIG = {
  API_BASE_URL: location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://api-fineduca.onrender.com",
  AUTH: {
    login: "/auth",
    register: "/user",
  },
};
