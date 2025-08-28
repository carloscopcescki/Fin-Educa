import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const pagesPath = path.join(__dirname, "public", "pages");

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/juros_compostos", (_req, res) =>
  res.sendFile(path.join(pagesPath, "juros_compostos.html"))
);
app.get("/juros_simples", (_req, res) =>
  res.sendFile(path.join(pagesPath, "juros_simples.html"))
);
app.get("/reserva", (_req, res) =>
  res.sendFile(path.join(pagesPath, "reserva.html"))
);

app.get("/api/news", async (req, res) => {
  try {
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

    const r = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`);
    const data = await r.json();

    if (!r.ok || data.status !== "ok") {
      const msg = (data && data.message) || `${r.status} ${r.statusText}`;
      return res.status(502).json({ error: `NewsAPI: ${msg}` });
    }

    const clean = (data.articles || [])
      .filter((a) => a && a.title && !/^\[?Removed\]?/i.test(a.title))
      .slice(0, Number(pageSize));

    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ articles: clean });
  } catch {
    res.status(500).json({ error: "Falha ao consultar notícias" });
  }
});

app.listen(PORT, () => console.log(`API em http://localhost:${PORT}`));