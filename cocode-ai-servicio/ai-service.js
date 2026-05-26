const http = require('http');

const server = http.createServer((req, res) => {
  // Configurar CORS para permitir peticiones desde tu React en Windows
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ENDPOINT NUEVO: Revisión y corrección de tareas/lecciones
  if (req.url === '/api/ai/review-task' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { leccion, codigoEstudiante } = JSON.parse(body);

        // Diseñamos el Prompt estructurado para Ollama
        const promptSystem = `Eres un profesor experto en programación. Debes evaluar el código de un estudiante basándote en la siguiente lección o tarea: "${leccion}".
        Analiza el código del estudiante: "${codigoEstudiante}".
        
        Debes responder ESTRICTAMENTE en formato JSON con la siguiente estructura, no agregues texto de saludo ni despedida:
        {
          "aprobado": true o false,
          "nota": "Un puntaje de 1.0 a 5.0",
          "feedback": "Explicación amigable de qué hizo bien y qué hizo mal",
          "correccion": "El bloque de código corregido u optimizado si es necesario"
        }`;

        // Llamamos al Ollama que está corriendo en tu Windows (usando el host-gateway de Docker)
        const responseOllama = await fetch('http://host.docker.internal:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3', // o el modelo que tengas descargado (ej: qwen, mistral)
            prompt: promptSystem,
            stream: false,
            format: 'json' // Le exigimos a Ollama que nos devuelva un JSON válido
          })
        });

        const dataOllama = await responseOllama.json();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Retornamos directamente el JSON estructurado del profesor IA al Frontend
        res.end(dataOllama.response);

      } catch (error) {
        console.error("Error en el microservicio de IA:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Error al procesar la revisión con la IA" }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "Microservicio de IA Educativa corriendo perfectamente" }));
  }
});

server.listen(3000, () => console.log('AI Educational Service escuchando en el puerto 3000'));
