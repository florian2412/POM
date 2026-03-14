/**
 * Augmentation du type Express.Request pour ajouter la propriété `user`
 * injectée par le middleware JWT d'authentification.
 */
declare namespace Express {
  interface Request {
    /** Payload JWT décodé, injecté par authMiddleware */
    user?: {
      /** Identifiant MongoDB de l'utilisateur connecté */
      id: string;
      /** Rôle de l'utilisateur : 'admin' | 'manager' | 'collaborateur' */
      role: string;
    };
  }
}
