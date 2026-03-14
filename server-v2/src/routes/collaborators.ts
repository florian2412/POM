import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { authMiddleware, requireRole } from '../middleware/auth';
import Collaborator from '../models/Collaborator';
import Project from '../models/Project';

const router = Router();

// Toutes les routes nécessitent une authentification
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

// ─── GET /api/collaborators ──────────────────────────────────────────────────
router.get(
  '/',
  requireRole('admin', 'manager'),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const collaborators = await Collaborator.find();
      res.json(collaborators);
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/collaborators/role/:role ──────────────────────────────────────
router.get(
  '/role/:role',
  requireRole('admin', 'manager'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const collaborators = await Collaborator.find({ role: req.params['role'] });
      res.json(collaborators);
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/collaborators/:id/projects ────────────────────────────────────
router.get(
  '/:id/projects',
  [param('id').isMongoId().withMessage('Invalid id')],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projects = await Project.find({ collaborateurs: req.params['id'] });
      res.json(projects);
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/collaborators/:id ─────────────────────────────────────────────
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid id')],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const collaborator = await Collaborator.findById(req.params['id']);
      if (!collaborator) {
        res.status(404).json({ success: false, message: 'Collaborateur introuvable' });
        return;
      }
      res.json(collaborator);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/collaborators ─────────────────────────────────────────────────
router.post(
  '/',
  requireRole('admin', 'manager'),
  [
    body('pseudo').trim().notEmpty().withMessage('Pseudo requis'),
    body('nom').trim().notEmpty().withMessage('Nom requis'),
    body('prenom').trim().notEmpty().withMessage('Prénom requis'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('mot_de_passe')
      .isLength({ min: 8 })
      .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    body('role')
      .isIn(['admin', 'manager', 'collaborateur'])
      .withMessage('Rôle invalide'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const existing = await Collaborator.findOne({ pseudo: req.body.pseudo as string });
      if (existing) {
        res.status(409).json({ success: false, message: 'Ce pseudo est déjà utilisé.' });
        return;
      }

      const { mot_de_passe, ...rest } = req.body as { mot_de_passe: string; [key: string]: unknown };
      const hashed = await bcrypt.hash(mot_de_passe, 12);
      const collaborator = await Collaborator.create({ ...rest, mot_de_passe: hashed });

      res.status(201).json({
        success: true,
        message: 'Collaborateur créé avec succès.',
        data: collaborator,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/collaborators/:id ─────────────────────────────────────────────
router.put(
  '/:id',
  requireRole('admin', 'manager'),
  [param('id').isMongoId().withMessage('Invalid id')],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Le changement de mot de passe se fait via PUT /api/auth/change-password
      const { mot_de_passe, ...update } = req.body as { mot_de_passe?: string; [key: string]: unknown };
      void mot_de_passe; // explicitement ignoré

      const collaborator = await Collaborator.findByIdAndUpdate(req.params['id'], update, {
        new: true,
        runValidators: true,
      });
      if (!collaborator) {
        res.status(404).json({ success: false, message: 'Collaborateur introuvable' });
        return;
      }
      res.json(collaborator);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/collaborators/:id ───────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('admin'),
  [param('id').isMongoId().withMessage('Invalid id')],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const collaborator = await Collaborator.findByIdAndDelete(req.params['id']);
      if (!collaborator) {
        res.status(404).json({ success: false, message: 'Collaborateur introuvable' });
        return;
      }
      res.json({ success: true, message: 'Collaborateur supprimé.' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
