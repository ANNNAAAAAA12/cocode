const http = require('http');
const mongoose = require('mongoose');

// Conectar a la base de datos de MongoDB en Docker
const mongoURI = process.env.MONGO_URI || 'mongodb://auth-db:27017/cocode_usuarios';
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado exitosamente a la Base de Datos de Usuarios'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

// Definir cómo se va a guardar una Persona de verdad
const PersonaSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  nombre: String,
  email: String,
  fechaRegistro: { type: Date, default: Date.now }
});

const Persona = mongoose.model('Persona', PersonaSchema);

const server = http.createServer(async (req, res) => {
  // Habilitar CORS para que tu React en Windows pueda enviar datos sin bloqueos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ENDPOINT REAL: Guardar o actualizar la persona cuando se loguea con Firebase
  if (req.url === '/api/auth/save-user' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { uid, nombre, email } = JSON.parse(body);

        // Buscar si la persona ya existe, si no, crearla (Upsert)
        const personaGuardada = await Persona.findOneAndUpdate(
          { firebaseUid: uid },
          { nombre, email },
          { new: true, upsert: true }
        );

        console.log(`Persona guardada en BD: ${personaGuardada.email}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: "Persona registrada de verdad en la Base de Datos", 
          data: personaGuardada 
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } 
  // ENDPOINT REAL: Listar todas las personas guardadas (Para que el profe vea que sí hay datos)
  else if (req.url === '/api/auth/users' && req.method === 'GET') {
    try {
      const personas = await Persona.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(personas));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "Servicio de Auth con persistencia MongoDB activo" }));
  }
});

server.listen(8001, () => console.log('Auth Service con MongoDB escuchando en el puerto 8001'));
