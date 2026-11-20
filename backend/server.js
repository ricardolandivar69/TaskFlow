import 'dotenv/config';
import { connectDatabase } from './src/config/database.js';
import app from './src/app.js';

async function start() {
  const secret = process.env.JWT_SECRET || '';
  if (secret.length < 32 || secret.includes('REEMPLAZAR')) {
    throw new Error('Configura un JWT_SECRET aleatorio de al menos 32 caracteres en backend/.env');
  }
  await connectDatabase();
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => console.log(`TaskFlow API: http://localhost:${port}/api/health`));
}

start().catch((error) => {
  console.error('No se pudo iniciar TaskFlow:', error.message);
  process.exit(1);
});
