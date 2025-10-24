import express from "express";
import cors from "cors";
import pkg from "follow-redirects";
const { http, https } = pkg;

const app = express();
app.use(cors());

app.get("/get-video", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL não informada." });

  const protocol = url.startsWith("https") ? https : http;

  protocol.get(url, (response) => {
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
    res.status(500).json({ error: "Erro ao buscar a página." });
  });
});

// Remova app.listen() — na Vercel isso quebra
export default app;