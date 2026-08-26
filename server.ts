import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser Middleware
  app.use(express.json());

  // Mount API Router First
  app.use('/api', apiRouter);

  // Simple Root Health route
  app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
  });

  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TiffinHub Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[TiffinHub Server] Startup error:', err);
  process.exit(1);
});
