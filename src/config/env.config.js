import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const REQUIRED_VARS = ['PORT', 'NODE_ENV'];

const missing = REQUIRED_VARS.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(
    `Faltan variables de entorno requeridas: ${missing.join(', ')}. ` +
      'Creá un archivo .env tomando como guía el archivo .env.example.'
  );
  process.exit(1);
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(
    `La variable PORT debe ser un número entero entre 1 y 65535 (valor recibido: "${process.env.PORT}").`
  );
  process.exit(1);
}

const config = {
  port,
  nodeEnv: process.env.NODE_ENV.trim(),
};

export default config;
