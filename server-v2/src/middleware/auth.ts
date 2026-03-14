import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

/** Payload contenu dans le JWT signé lors de la connexion. */
interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware Express qui valide le token JWT Bearer sur les routes protégées.
 * En cas de succès, injecte `req.user = { id, role }` dans la requête.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: String(payload.id), role: payload.role };
    next();
  } catch (err: unknown) {
    const message =
      err instanceof jwt.TokenExpiredError ? 'Token expired' : 'Invalid token';
    res.status(401).json({ success: false, message });
  }
}

/**
 * Factory de middleware qui n'autorise que les utilisateurs ayant l'un des rôles spécifiés.
 * Doit être utilisé **après** `authMiddleware`.
 *
 * @param roles - Rôles autorisés (ex : 'admin', 'manager', 'collaborateur')
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    next();
  };
}
