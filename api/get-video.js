import express from "express";
import cors from "cors";
import pkg from "follow-redirects";
const { http, https } = pkg;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL não informada." });

  const decodedUrl = decodeURIComponent(url);
  const protocol = decodedUrl.startsWith("https") ? https : http;

  const options = {
    headers: {
      // Simula um navegador real
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }
  };

  protocol.get(decodedUrl, options, (response) => {
    let html = "";

    response.on("data", (chunk) => (html += chunk));
    response.on("end", () => {
      const match = html.match(/<video[^>]+src="([^"]+)"/);
      if (match && match[1]) {
        res.json({ videoUrl: match[1] });
      } else {
        res.status(404).json({ error: "Vídeo não encontrado no HTML." });
      }
    });
  }).on("error", (err) => {
    console.error("Erro ao buscar a página:", err.message);
    res.status(500).json({ error: "Erro ao buscar a página." });
  });
});

export default app;
