import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import { authMiddleware } from '../middleware/auth';
import Collaborator from '../models/Collaborator';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('pseudo').trim().notEmpty().withMessage('Pseudo requis'),
    body('mot_de_passe').notEmpty().withMessage('Mot de passe requis'),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const { pseudo, mot_de_passe } = req.body as {
        pseudo: string;
        mot_de_passe: string;
      };

      const collaborator = await Collaborator.findOne({ pseudo }).select('+mot_de_passe');
      if (!collaborator) {
        res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        return;
      }

      const isMatch = await bcrypt.compare(mot_de_passe, collaborator.mot_de_passe!);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        return;
      }

      const token = jwt.sign(
        { id: collaborator._id, role: collaborator.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      // Le mot de passe est supprimé par la transformation toJSON du schéma
      res.json({ success: true, message: 'Connexion réussie', token, collaborator });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/auth/reset-password ──────────────────────────────────────────
router.post(
  '/reset-password',
  [body('pseudo').trim().notEmpty().withMessage('Pseudo requis')],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const collaborator = await Collaborator.findOne({ pseudo: req.body.pseudo as string });
      if (!collaborator) {
        // Ne pas révéler si le compte existe
        res.json({
          success: true,
          message: 'Si ce pseudo existe, un email de réinitialisation a été envoyé.',
        });
        return;
      }

      const newPassword = crypto.randomBytes(8).toString('hex');
      const hashed = await bcrypt.hash(newPassword, 12);
      collaborator.mot_de_passe = hashed;
      await collaborator.save();

      // Envoi email si Mailgun est configuré
      if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const mailgun = require('mailgun-js')({
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
          }) as {
            messages: () => {
              send: (msg: Record<string, string>) => Promise<unknown>;
            };
          };
          await mailgun.messages().send({
            from: process.env.MAILGUN_FROM || 'POM <noreply@example.com>',
            to: collaborator.email,
            subject: 'Réinitialisation de votre mot de passe | POM',
            text: `Bonjour ${collaborator.pseudo}, votre nouveau mot de passe est : ${newPassword}\nVeuillez le changer après connexion.`,
          });
        } catch (mailErr: unknown) {
          const errMsg = mailErr instanceof Error ? mailErr.message : String(mailErr);
          console.error('Email send error:', errMsg);
        }
      }

      res.json({
        success: true,
        message: 'Si ce pseudo existe, un email de réinitialisation a été envoyé.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/auth/change-password ──────────────────────────────────────────
router.put(
  '/change-password',
  authMiddleware,
  [
    body('current_password').notEmpty().withMessage('Mot de passe actuel requis'),
    body('new_password')
      .isLength({ min: 8 })
      .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères'),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const collaborator = await Collaborator.findById(req.user!.id).select('+mot_de_passe');
      if (!collaborator) {
        res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        return;
      }

      const isMatch = await bcrypt.compare(
        req.body.current_password as string,
        collaborator.mot_de_passe!
      );
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
        return;
      }

      collaborator.mot_de_passe = await bcrypt.hash(req.body.new_password as string, 12);
      await collaborator.save();

      res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const collaborator = await Collaborator.findById(req.user!.id);
    if (!collaborator) {
      res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
      return;
    }
    res.json({ success: true, collaborator });
  } catch (err) {
    next(err);
  }
});

export default router;
