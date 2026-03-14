import { Router, Request, Response } from 'express';
import pkg from '../../package.json';

const router = Router();

// ─── GET /api/version ────────────────────────────────────────────────────────
/** Retourne la version de l'API définie dans package.json */
router.get('/', (_req: Request, res: Response) => {
  res.json({ api: (pkg as { version: string }).version });
});

export default router;
