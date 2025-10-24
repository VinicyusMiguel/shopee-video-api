import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/get-video", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL não informada." });

  try {
    const { data: html } = await axios.get(url);
    const match = html.match(/<video[^>]+src="([^"]+)"/);
    if (match && match[1]) {
      res.json({ videoUrl: match[1] });
    } else {
      res.status(404).json({ error: "Vídeo não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar o vídeo." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
