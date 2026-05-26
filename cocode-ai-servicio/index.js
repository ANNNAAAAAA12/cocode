const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Tu IP real de Wi-Fi en Windows
const OLLAMA_URL = 'http://192.168.1.15:11434/api/chat';

app.post('/api/ai/review-task', async (req, res) => {
  const { code, taskInstructions } = req.body;

  if (!code) {
    return res.status(400).json({ review: "❌ Código vacío." });
  }

  const sistemaPrompt = "Eres un mentor experto en JavaScript. Tu única tarea es evaluar el código del estudiante con base en las instrucciones. Sé estricto, califica de 0 a 100 con el formato: '⭐ CALIFICACIÓN: [nota]/100' seguido de los puntos a corregir.";
  const usuarioPrompt = `INSTRUCCIONES:\n"${taskInstructions}"\n\nCÓDIGO DEL ESTUDIANTE:\n\`\`\`javascript\n${code}\n\`\`\``;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        messages: [
          { role: 'system', content: sistemaPrompt },
          { role: 'user', content: usuarioPrompt }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ review: data.message?.content || "No se pudo generar el análisis." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ review: "⚠️ Error: No hay conexión con Ollama en Windows. Verifica el puerto 11434." });
  }
});

app.listen(3000, () => {
  console.log('🚀 Microservicio de IA Sakura activo en puerto 3000');
});
