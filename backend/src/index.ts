import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import merchantRoutes from './routes/merchants';
import productRoutes from './routes/products';
import sessionRoutes from './routes/sessions';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/merchants', merchantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'nego-bot', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Nego Bot API running on http://localhost:${PORT}`);
});

export default app;
