(function () {
  const NEWS_ENDPOINT =
    (window.ENDPOINTS && window.ENDPOINTS.NEWS) ||
    (window.API_BASE ? `${window.API_BASE}/api/news` : "/api/news");

  const container = document.getElementById("news-cards");
  if (!container) return;

  // Renderiza skeletons enquanto carrega
  const SKELETON_COUNT = 4;
  function renderSkeletons() {
    container.innerHTML = "";
    for (let i = 0; i < SKELETON_COUNT; i++) {
      const card = document.createElement("article");
      card.className = "news-card skeleton";
      card.innerHTML = `
        <div class="thumb"></div>
        <div class="content">
          <div class="line title"></div>
          <div class="line"></div>
          <div class="line small"></div>
        </div>
      `;
      container.appendChild(card);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function fmtDate(isoStr) {
    try {
      const d = new Date(isoStr);
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {
      return "";
    }
  }

  function renderError(msg) {
    container.innerHTML = `
      <div class="news-error">
        <p>😕 Não deu pra carregar as notícias agora.</p>
        <pre>${escapeHtml(msg || "Erro desconhecido")}</pre>
        <button id="news-retry" class="news-retry">Tentar de novo</button>
      </div>`;
    document.getElementById("news-retry")?.addEventListener("click", load);
  }

  function renderArticles(articles) {
    container.innerHTML = "";
    if (!articles || !articles.length) {
      container.innerHTML = `<p>Sem resultados por enquanto. Tente outro tema mais tarde 😉</p>`;
      return;
    }

    for (const a of articles) {
      const title = escapeHtml(a.title || "Sem título");
      const desc = escapeHtml(a.description || "");
      const url = a.url || "#";
      const img =
        a.urlToImage ||
        "https://placehold.co/600x360/png?text=Sem+imagem"; // fallback
      const source = escapeHtml(a.source?.name || "Fonte");
      const when = fmtDate(a.publishedAt);

      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        <a class="thumb-wrap" href="${url}" target="_blank" rel="noopener noreferrer">
          <img class="thumb" src="${img}" alt="${title}" loading="lazy">
        </a>
        <div class="content">
          <a class="title" href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
          <p class="desc">${desc}</p>
          <div class="meta">
            <span class="source">${source}</span>
            <span class="dot">•</span>
            <time datetime="${a.publishedAt || ""}">${when}</time>
          </div>
        </div>
      `;
      container.appendChild(card);
    }
  }

  async function load(params = {}) {
    try {
      renderSkeletons();

      // Parâmetros padrão (batem com a sua rota no backend)
      const q = params.q || "bolsa de valores";
      const pageSize = params.pageSize || 4;
      const to = params.to;     // opcional: YYYY-MM-DD
      const from = params.from; // opcional: YYYY-MM-DD

      const usp = new URLSearchParams({ q, pageSize: String(pageSize) });
      if (from) usp.set("from", from);
      if (to) usp.set("to", to);

      const url = `${NEWS_ENDPOINT}?${usp.toString()}`;
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data.error) {
        throw new Error(data?.error || `${res.status} ${res.statusText}`);
      }

      renderArticles(data.articles || []);
    } catch (err) {
      renderError(err?.message || String(err));
    }
  }

  window.fineducaNews = {
    reload: load,
    setQuery(q) { load({ q }); },
  };

  load();
})();