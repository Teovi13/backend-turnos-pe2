import express from 'express';
import servicesRouter from './routes/services.router.js';

const app = express();

app.use(express.json());

app.use('/api/services', servicesRouter);

app.use((req, res) => {
  res.status(404).json({ status: 'error', error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', error: 'El body no es un JSON válido' });
  }
  console.error(error);
  return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
});

export default app;
