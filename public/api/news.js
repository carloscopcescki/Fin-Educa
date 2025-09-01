export default async function handler(req, res) {
  try {
    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "API_KEY ausente no ambiente Vercel" });
    }

    const { q = "bolsa de valores", from, to, pageSize = "4" } = req.query;
    const toDate = to ? new Date(to) : new Date();
    const fromDate = from ? new Date(from) : new Date(toDate.getTime() - 20 * 864e5);
    const iso = (d) => d.toISOString().split("T")[0];

    const params = new URLSearchParams({
      q,
      language: "pt",
      sortBy: "publishedAt",
      pageSize: String(pageSize),
      from: iso(fromDate),
      to: iso(toDate),
      apiKey: process.env.API_KEY,
    });

    const url = `https://newsapi.org/v2/everything?${params.toString()}`;

    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));

    if (!r.ok || data.status !== "ok") {
      const msg = (data && data.message) || `${r.status} ${r.statusText}`;
      console.error("NewsAPI error:", { status: r.status, msg, urlNoKey: url.replace(process.env.API_KEY, "***") });
      return res.status(502).json({ error: `NewsAPI: ${msg}` });
    }

    const clean = (data.articles || [])
      .filter((a) => a && a.title && !/^\[?Removed\]?/i.test(a.title))
      .slice(0, Number(pageSize));

    res.setHeader("Cache-Control", "public, max-age=60");
    return res.json({ articles: clean });
  } catch (e) {
    console.error("Handler crash:", e);
    return res.status(500).json({ error: "Falha ao consultar notícias", detail: String(e && e.message || e) });
  }
}