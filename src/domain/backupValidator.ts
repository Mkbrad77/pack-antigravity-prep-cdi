import { ALLOWED_PROVENANCE_TAGS, BackupPayload } from './types';

export const CURRENT_BACKUP_SCHEMA_VERSION = 1;

export interface BackupValidationResult {
  valid: boolean;
  errors: string[];
  payload?: BackupPayload;
}

/**
 * Valide rigoureusement un fichier JSON de sauvegarde avant toute restauration dans SQLite.
 */
export function validateBackupPayload(input: unknown): BackupValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Le contenu JSON doit être un objet valide.'] };
  }

  const obj = input as Record<string, unknown>;

  if (obj.app !== 'pack-antigravity-prep-cdi') {
    errors.push(
      `Identifiant d'application invalide : attendu "pack-antigravity-prep-cdi", reçu "${String(obj.app)}".`
    );
  }

  if (typeof obj.schema_version !== 'number' || obj.schema_version < 1 || obj.schema_version > CURRENT_BACKUP_SCHEMA_VERSION) {
    errors.push(
      `Version de schéma non supportée : ${String(obj.schema_version)} (version attendue : 1 à ${CURRENT_BACKUP_SCHEMA_VERSION}).`
    );
  }

  if (typeof obj.exported_at !== 'string' || !obj.exported_at.trim()) {
    errors.push('Le champ exported_at (date d\'export) est manquant ou invalide.');
  }

  if (!obj.data || typeof obj.data !== 'object') {
    errors.push('Le bloc "data" est manquant dans le fichier de sauvegarde.');
    return { valid: false, errors };
  }

  const data = obj.data as Record<string, unknown>;
  const requiredArrays = [
    'lesson_progress',
    'task_states',
    'task_history',
    'study_sessions',
    'mock_exams',
    'error_journal',
    'flashcards',
  ];

  for (const key of requiredArrays) {
    if (!Array.isArray(data[key])) {
      errors.push(`Le tableau "data.${key}" est manquant ou invalide.`);
    }
  }

  if (!data.settings || typeof data.settings !== 'object') {
    errors.push('L\'objet "data.settings" est manquant ou invalide.');
  }

  if (Array.isArray(data.flashcards)) {
    for (let i = 0; i < data.flashcards.length; i++) {
      const card = data.flashcards[i] as Record<string, unknown>;
      if (!card || typeof card.id !== 'string' || typeof card.front !== 'string') {
        errors.push(`Carte flashcard à l'index ${i} mal formée.`);
        continue;
      }
      if (!ALLOWED_PROVENANCE_TAGS.includes(card.provenance as never)) {
        errors.push(
          `Carte flashcard "${card.id}" possède une étiquette de provenance non autorisée : "${String(card.provenance)}".`
        );
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    payload: obj as unknown as BackupPayload,
  };
}
