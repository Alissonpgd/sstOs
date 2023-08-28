const http = require('http');
const child_process = require('child_process');

const server = http.createServer((req, res) => {
  if (req.url === '/start-api') {
    child_process.exec('node api.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao iniciar a API: ${error}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao iniciar a API.');
      } else {
        console.log('API iniciada com sucesso.');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('API iniciada com sucesso.');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint não encontrado.');
  }
});

server.listen(3000, () => {
  console.log('Servidor de inicialização da API iniciado na porta 3000.');
});
