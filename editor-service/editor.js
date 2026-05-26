const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "Editor Service Operando de forma independiente" }));
});
server.listen(8002, () => console.log('Editor Service escuchando en puerto 8002'));
