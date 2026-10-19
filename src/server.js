import config from './config/env.config.js';
import app from './app.js';

const server = app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port} (${config.nodeEnv})`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${config.port} ya está en uso. Cambiá PORT en el archivo .env.`);
  } else {
    console.error(`No se pudo iniciar el servidor: ${error.message}`);
  }
  process.exit(1);
});
