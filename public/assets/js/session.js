// Utilitários
const getToken = () => localStorage.getItem("token");
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

// Exemplo de proteção (se quiser obrigar login no index):
// if (!getToken() && location.pathname === "/") {
//   location.href = "/auth/login.html";
// }

// Exibir nome/avatar se houver placeholders na navbar
document.addEventListener("DOMContentLoaded", () => {
  const u = getUser();
  const nameEl = document.querySelector("[data-user-name]");
  const avatarEl = document.querySelector("[data-user-avatar]");

  if (nameEl && u?.name) nameEl.textContent = u.name;
  if (avatarEl && u?.avatar) avatarEl.src = u.avatar;
});
