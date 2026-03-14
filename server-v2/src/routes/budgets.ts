import { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authMiddleware, requireRole } from '../middleware/auth';
import Budget from '../models/Budget';

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

// ─── GET /api/budgets ────────────────────────────────────────────────────────
router.get('/', requireRole('admin'), async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(await Budget.find());
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/budgets/:id ────────────────────────────────────────────────────
router.get(
  '/:id',
  requireRole('admin'),
  [param('id').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const budget = await Budget.findById(req.params['id']);
      if (!budget) {
        res.status(404).json({ success: false, message: 'Ligne budgétaire introuvable' });
        return;
      }
      res.json(budget);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/budgets ───────────────────────────────────────────────────────
router.post(
  '/',
  requireRole('admin'),
  [
    body('libelle').trim().notEmpty().withMessage('Libellé requis'),
    body('montant').isFloat({ min: 0 }).withMessage('Montant invalide'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const budget = await Budget.create(req.body);
      res.status(201).json(budget);
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/budgets/:id ────────────────────────────────────────────────────
router.put(
  '/:id',
  requireRole('admin'),
  [param('id').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const budget = await Budget.findByIdAndUpdate(req.params['id'], req.body, {
        new: true,
        runValidators: true,
      });
      if (!budget) {
        res.status(404).json({ success: false, message: 'Ligne budgétaire introuvable' });
        return;
      }
      res.json(budget);
    } catch (err) {
      next(err);
    }
  }
);

// ─── DELETE /api/budgets/:id ─────────────────────────────────────────────────
router.delete(
  '/:id',
  requireRole('admin'),
  [param('id').isMongoId()],
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const budget = await Budget.findByIdAndDelete(req.params['id']);
      if (!budget) {
        res.status(404).json({ success: false, message: 'Ligne budgétaire introuvable' });
        return;
      }
      res.json({ success: true, message: 'Ligne budgétaire supprimée.' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
