import express from "express";
import cors from "cors";
import pkg from "follow-redirects";
const { http, https } = pkg;

const app = express();
app.use(cors());

app.get("/get-video", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL não informada." });

  // Se o link vier com ? e &, encode automaticamente para evitar quebra na query
  const safeUrl = encodeURI(url); 
  const protocol = safeUrl.startsWith("https") ? https : http;

  protocol.get(safeUrl, (response) => {
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
  }).on("error", () => {
    res.status(500).json({ error: "Erro ao buscar a página." });
  });
});

export default app;
