/**
 * Pure utility functions for working-day calculations and task/project statistics.
 * Mirrors the logic from the original v1 statisticsService and utilsService.
 */

/** Returns the number of working days between start and end (inclusive) */
export function dateDiffWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  const finish = new Date(end);
  current.setHours(0, 0, 0, 0);
  finish.setHours(0, 0, 0, 0);
  while (current <= finish) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

/** Returns true if the date is a working day */
export function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

/** Elapsed working days from start to today */
export function getSpentTime(dateDebut: string | Date): number {
  return dateDiffWorkingDays(new Date(dateDebut), new Date());
}

/** Total real working days (start → real end) */
export function getTotalRealTime(dateDebut: string | Date, dateFinReelle: string | Date): number {
  return dateDiffWorkingDays(new Date(dateDebut), new Date(dateFinReelle));
}

/** Theoretical duration in working days */
export function getDuration(dateDebut: string | Date, dateFinTheorique: string | Date): number {
  return dateDiffWorkingDays(new Date(dateDebut), new Date(dateFinTheorique));
}

export const STATUS_COLORS: Record<string, string> = {
  'Initial': '#2196F3',
  'En cours': '#FF9800',
  'Terminé(e)': '#4CAF50',
  'Annulé(e)': '#F44336',
  'Archivé': '#9E9E9E',
};

export const CATEGORY_COLORS: Record<string, string> = {
  'Etude de projet': '#F44336',
  'Spécification': '#FF9800',
  'Développement': '#2196F3',
  'Recette': '#FFEB3B',
  'Mise en production': '#4CAF50',
};

/** Generates next project code for a given year */
export function generateProjectCode(year: number, existingCodes: string[]): string {
  const prefix = `${year}P`;
  let maxNum = 0;
  for (const code of existingCodes) {
    if (code && code.startsWith(prefix)) {
      const num = parseInt(code.slice(5), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
}

/** Generates next task code for a project */
export function generateTaskCode(projectCode: string, existingTaskCodes: string[]): string {
  let maxNum = 0;
  const prefix = `${projectCode}T`;
  for (const code of existingTaskCodes) {
    if (code && code.startsWith(prefix)) {
      const num = parseInt(code.slice(prefix.length), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
}

/** Counts occurrences of each term and returns [labels, values] */
export function countByTerm(terms: string[]): [string[], number[]] {
  const map: Record<string, number> = {};
  for (const t of terms) {
    map[t] = (map[t] || 0) + 1;
  }
  return [Object.keys(map), Object.values(map)];
}
