import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import settings from '../../settings.json';

/** Type du fichier settings.json */
interface AppSettings {
  roles: string[];
  fonctions: string[];
  statuts: string[];
  categories: string[];
}

const appSettings = settings as AppSettings;

const router = Router();

// Toutes les routes requièrent une authentification
router.use(authMiddleware);

// ─── GET /api/settings ───────────────────────────────────────────────────────
router.get('/', (_req: Request, res: Response) => res.json(appSettings));

// ─── GET /api/settings/roles ─────────────────────────────────────────────────
router.get('/roles', (_req: Request, res: Response) => res.json(appSettings.roles));

// ─── GET /api/settings/fonctions ─────────────────────────────────────────────
router.get('/fonctions', (_req: Request, res: Response) => res.json(appSettings.fonctions));

// ─── GET /api/settings/statuts ───────────────────────────────────────────────
router.get('/statuts', (_req: Request, res: Response) => res.json(appSettings.statuts));

// ─── GET /api/settings/categories ───────────────────────────────────────────
router.get('/categories', (_req: Request, res: Response) => res.json(appSettings.categories));

export default router;
