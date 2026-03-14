import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authMiddleware, requireRole } from '../middleware/auth';
import Project from '../models/Project';

const router = Router();

router.use(authMiddleware);

/** Middleware de validation — renvoie 422 si des erreurs existent. */
function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return;
  }
  next();
}

// ─── GET /api/projects ───────────────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.find()
      .populate('chef_projet', 'nom prenom pseudo')
      .populate('collaborateurs', 'nom prenom pseudo');
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/projects/generate-code ────────────────────────────────────────
/**
 * Retourne le prochain code projet disponible pour une année donnée.
 * Format : `{ANNÉE}P{NNN}` (ex : 2024P001)
 * Query param : `year` (optionnel, défaut = année courante)
 */
router.get(
  '/generate-code',
  requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = (req.query['year'] as string) || String(new Date().getFullYear());
      const prefix = `${year}P`;

      const projects = await Project.find({ code: { $regex: `^${year}P` } }).select('code');
      let maxNum = 0;
      for (const p of projects) {
        if (p.code) {
          const num = parseInt(p.code.slice(5), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      }
      const nextCode = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
      res.json({ code: nextCode });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/projects/:id ───────────────────────────────────────────────────
router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findById(req.params['id'])
        .populate('chef_projet', 'nom prenom pseudo')
        .populate('collaborateurs', 'nom prenom pseudo');
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }
      res.json(project);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/projects ──────────────────────────────────────────────────────
router.post(
  '/',
  requireRole('admin', 'manager'),
  [
    body('nom').trim().notEmpty().withMessage('Nom requis'),
    body('statut')
      .optional()
      .isIn(['Initial', 'En cours', 'Terminé(e)', 'Annulé(e)', 'Archivé']),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.create(req.body);
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────
router.put(
  '/:id',
  requireRole('admin', 'manager'),
  [param('id').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findByIdAndUpdate(req.params['id'], req.body, {
        new: true,
        runValidators: true,
      })
        .populate('chef_projet', 'nom prenom pseudo')
        .populate('collaborateurs', 'nom prenom pseudo');
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }
      res.json(project);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/projects/:id ────────────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('admin', 'manager'),
  [param('id').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findByIdAndDelete(req.params['id']);
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }
      res.json({ success: true, message: 'Projet supprimé.' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
