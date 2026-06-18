import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

import merchantRoutes from './routes/merchants';
import productRoutes from './routes/products';
import sessionRoutes from './routes/sessions';
import contentRoutes from './routes/content';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve widget bundle as a public static file
app.use(express.static(path.join(__dirname, '..', 'public'), {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  },
}));

// Global rate limit
app.use('/api', apiLimiter);

// Routes
app.use('/api/merchants', merchantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'nego-bot', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error & { code?: string }, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.code ?? '', err.message);
  res.status(500).json({ error: 'Internal server error', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`Nego Bot API running on http://localhost:${PORT}`);
});

export default app;
