const form = document.getElementById("registerForm");
const msg = document.getElementById("registerMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Cadastrando...";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    avatar: form.avatar.value.trim() || undefined,
  };

  try {
    const r = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.AUTH.register}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!r.ok) {
      msg.textContent = data?.error || "Falha no cadastro";
      return;
    }
    // opcional: já loga automaticamente:
    // localStorage.setItem("token", data.token);
    // localStorage.setItem("user", JSON.stringify(data.user || {}));
    // window.location.href = "/";

    // Ou redireciona para login:
    window.location.href = "/auth/login.html";
  } catch {
    msg.textContent = "Erro de rede ao cadastrar.";
  }
});
