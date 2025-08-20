import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// A URL será pega das "Variáveis de Ambiente" da Vercel (mais seguro)
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

// Rota para buscar os itens já escolhidos
app.get("/api/itens-escolhidos", async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL); 
    const data = await response.json();
    if (data.status === "sucesso") res.json(data.itens);
    else res.status(500).json({ error: data.mensagem });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar a lista de itens." });
  }
});

// Rota para confirmar uma nova escolha
app.post("/api/confirmar", async (req, res) => {
  const { nome, item } = req.body;
  if (!nome || !item) return res.status(400).json({ error: "Nome e item são obrigatórios" });
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, item })
    });
    const data = await response.json();
    if (data.status === "erro") return res.status(400).json({ error: data.mensagem });
    res.json({ success: true, message: "Confirmação enviada!" });
  } catch (err) {
    res.status(500).json({ error: "Erro interno ao se comunicar com a planilha." });
  }
});

// Permite que a Vercel utilize o nosso app
export default app;