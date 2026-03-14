import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import projectsRouter from './routes/projects';
import tasksRouter from './routes/tasks';
import collaboratorsRouter from './routes/collaborators';
import budgetsRouter from './routes/budgets';
import settingsRouter from './routes/settings';
import versionRouter from './routes/version';

const app = express();

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins: string[] = (process.env['CORS_ORIGINS'] || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ─── Rate limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/** Limiteur plus strict pour les endpoints d'authentification. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ─── HTTP logging ────────────────────────────────────────────────────────────
if (process.env['NODE_ENV'] !== 'test') {
  app.use(morgan('dev'));
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/projects/:projectId/tasks', tasksRouter);
app.use('/api/collaborators', collaboratorsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/version', versionRouter);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status ?? 500;
  const message =
    process.env['NODE_ENV'] === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : err.message;
  res.status(statusCode).json({ success: false, message });
});

// ─── MongoDB connection ──────────────────────────────────────────────────────
const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/dbPOM';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`MongoDB connected: ${MONGODB_URI}`))
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Start server ────────────────────────────────────────────────────────────
const PORT = parseInt(process.env['PORT'] || '3000', 10);
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default app;
