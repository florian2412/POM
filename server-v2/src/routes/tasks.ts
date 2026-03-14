import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { authMiddleware, requireRole } from '../middleware/auth';
import Project, { IEmbeddedTask } from '../models/Project';
import { TaskCategory, TaskStatus } from '../models/Task';

/**
 * Router pour les tâches embarquées dans un projet.
 * Monté sur `/api/projects/:projectId/tasks` avec `mergeParams: true`
 * afin d'accéder au paramètre `:projectId` du routeur parent.
 */
const router = Router({ mergeParams: true });

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

// ─── GET /api/projects/:projectId/tasks ─────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.params['projectId']);
    if (!project) {
      res.status(404).json({ success: false, message: 'Projet introuvable' });
      return;
    }
    res.json(project.taches || []);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/projects/:projectId/tasks ────────────────────────────────────
router.post(
  '/',
  requireRole('admin', 'manager'),
  [
    body('libelle').trim().notEmpty().withMessage('Libellé requis'),
    body('categorie')
      .isIn([
        'Etude de projet',
        'Spécification',
        'Développement',
        'Recette',
        'Mise en production',
      ] satisfies TaskCategory[])
      .withMessage('Catégorie invalide'),
    body('date_debut').optional().isISO8601().withMessage('Date début invalide'),
    body('date_fin_theorique').optional().isISO8601().withMessage('Date fin théorique invalide'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findById(req.params['projectId']);
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }

      // Génération automatique du code tâche
      let maxCode = 0;
      for (const t of project.taches) {
        if (t.code) {
          const num = parseInt(t.code.replace(/.*T/, ''), 10);
          if (!isNaN(num) && num > maxCode) maxCode = num;
        }
      }
      const codeNum = String(maxCode + 1).padStart(3, '0');
      const taskCode = `${project.code ?? ''}T${codeNum}`;

      const body = req.body as {
        libelle: string;
        categorie: TaskCategory;
        description?: string;
        date_debut?: string;
        date_fin_theorique?: string;
        collaborateurs?: string[];
      };

      const task: Partial<IEmbeddedTask> = {
        _id: new mongoose.Types.ObjectId(),
        libelle: body.libelle,
        code: taskCode,
        categorie: body.categorie,
        description: body.description || '',
        date_debut: body.date_debut ? new Date(body.date_debut) : new Date(),
        date_fin_theorique: body.date_fin_theorique ? new Date(body.date_fin_theorique) : new Date(),
        statut: 'Initial',
        collaborateurs: (body.collaborateurs || []).map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
        projet_id: project._id as mongoose.Types.ObjectId,
      };

      project.taches.push(task as IEmbeddedTask);
      await project.save();

      res.status(201).json(project.taches[project.taches.length - 1]);
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/projects/:projectId/tasks/:taskId ──────────────────────────────
router.get(
  '/:taskId',
  [param('taskId').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findById(req.params['projectId']);
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }

      const task = project.taches.id(String(req.params['taskId']));
      if (!task) {
        res.status(404).json({ success: false, message: 'Tâche introuvable' });
        return;
      }

      res.json(task);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/projects/:projectId/tasks/:taskId ──────────────────────────────
router.put(
  '/:taskId',
  requireRole('admin', 'manager'),
  [param('taskId').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findById(req.params['projectId']);
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }

      const task = project.taches.id(String(req.params['taskId']));
      if (!task) {
        res.status(404).json({ success: false, message: 'Tâche introuvable' });
        return;
      }

      const allowed: Array<keyof IEmbeddedTask> = [
        'libelle',
        'description',
        'categorie',
        'statut',
        'date_debut',
        'date_fin_theorique',
        'date_fin_reelle',
        'collaborateurs',
      ];

      const update = req.body as Partial<IEmbeddedTask>;
      for (const key of allowed) {
        if (update[key] !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (task as any)[key] = update[key];
        }
      }

      await project.save();
      res.json(task);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/projects/:projectId/tasks/:taskId ───────────────────────────
router.delete(
  '/:taskId',
  requireRole('admin', 'manager'),
  [param('taskId').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await Project.findById(req.params['projectId']);
      if (!project) {
        res.status(404).json({ success: false, message: 'Projet introuvable' });
        return;
      }

      const task = project.taches.id(String(req.params['taskId']));
      if (!task) {
        res.status(404).json({ success: false, message: 'Tâche introuvable' });
        return;
      }

      task.deleteOne();
      await project.save();
      res.json({ success: true, message: 'Tâche supprimée.' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
