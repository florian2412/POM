/**
 * @fileoverview Script de génération du fichier d'environnement Angular pour la production.
 *
 * Ce script est exécuté avant le build de production (`npm run build:prod`).
 * Il lit la variable d'environnement `API_URL` (définie dans le tableau de bord Vercel
 * ou dans votre shell local) et génère le fichier `src/environments/environment.prod.ts`
 * avec la bonne valeur d'`apiUrl`.
 *
 * Si `API_URL` n'est pas définie, la valeur par défaut `/api` est utilisée
 * (compatible avec le mode auto-hébergé Docker + Nginx qui proxifie `/api/*`).
 *
 * @usage
 *   node scripts/set-env.mjs
 *   API_URL=https://mon-api.onrender.com/api node scripts/set-env.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** URL de base de l'API (ex : https://mon-api.onrender.com/api ou /api en mode proxy) */
const apiUrl = process.env['API_URL'] || '/api';

const content = `// ⚠️  Fichier auto-généré par scripts/set-env.mjs — NE PAS MODIFIER MANUELLEMENT
// Regénérez-le avec : node scripts/set-env.mjs
// Variable d'environnement source : API_URL="${apiUrl}"
export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

const outPath = join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
writeFileSync(outPath, content, 'utf8');
console.log(`[set-env] ✅  environment.prod.ts généré → apiUrl = "${apiUrl}"`);
