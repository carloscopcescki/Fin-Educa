function formatDate(ptISOString) {
  try {
    const d = new Date(ptISOString);
    return (
      d.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return "";
  }
}

function renderLoading(container, qty = 4) {
  container.innerHTML = Array.from({ length: qty })
    .map(
      () => `
      <article class="news-card loading">
        <div class="news-thumb"></div>
        <div class="news-content">
          <h3 class="news-title shimmer"></h3>
          <p class="news-meta shimmer"></p>
          <p class="news-desc shimmer"></p>
        </div>
      </article>`
    )
    .join("");
}

function renderArticles(container, articles) {
  if (!articles || articles.length === 0) {
    container.innerHTML = `
      <div class="news-empty">
        Sem novidades por enquanto. O mercado tirou um café.
      </div>`;
    return;
  }

  const html = articles
    .map((a) => {
      const title = a.title || "Sem título";
      const desc = a.description || "";
      const link = a.url || "#";
      const img = a.urlToImage || "./assets/img/news_fallback.jpg";
      const fonte =
        a.source && a.source.name ? a.source.name : "Fonte desconhecida";
      const data = a.publishedAt ? formatDate(a.publishedAt) : "";

      return `
      <article class="news-card">
        <a class="news-thumb-wrap" href="${link}" target="_blank" rel="noopener noreferrer">
          <img class="news-thumb" src="${img}" alt="${title}">
        </a>
        <div class="news-content">
          <h3 class="news-title">
            <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
          </h3>
          <p class="news-meta">${fonte}${data ? " • " + data : ""}</p>
          <p class="news-desc">${desc}</p>
          <a class="news-link" href="${link}" target="_blank" rel="noopener noreferrer">Ler matéria</a>
        </div>
      </article>`;
    })
    .join("");

  const containerEl = document.getElementById("news-cards");
  if (containerEl) containerEl.innerHTML = html;
}

function buildClientUrl() {
  const toDate = new Date();
  const fromDate = new Date(toDate.getTime() - 20 * 864e5);
  const iso = (d) => d.toISOString().split("T")[0];

  const params = new URLSearchParams({
    q: "bolsa de valores",
    from: iso(fromDate),
    to: iso(toDate),
    pageSize: "4",
  });

  return `/api/news?${params.toString()}`;
}

async function initNews() {
  const container = document.getElementById("news-cards");
  if (!container) return;

  renderLoading(container);

  try {
    const res = await fetch(buildClientUrl());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderArticles(container, data.articles || []);
  } catch (err) {
    console.error("Erro ao carregar notícias:", err);
    container.innerHTML = `
      <div class="news-error">
        Não deu para carregar as notícias agora. Tenta recarregar a página em 1 min.
      </div>`;
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNews);
} else {
  initNews();
}