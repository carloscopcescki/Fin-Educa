const form = document.getElementById("loginForm");
const msg = document.getElementById("loginMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Entrando...";

  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    const r = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.login}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await r.json();
    if (!r.ok) {
      msg.textContent = data?.error || "Falha no login";
      return;
    }

    // Assumindo retorno { token, user: { id, name, avatar, email } }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || {}));

    // Depois de logar, manda para o index da sua landing
    window.location.href = "/";
  } catch {
    msg.textContent = "Erro de rede ao fazer login.";
  }
});
