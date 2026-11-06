import React, { useState } from 'react';
import { CalendarDays, Database, Download, Moon, Palette, SlidersHorizontal, Sun, TriangleAlert, Upload } from 'lucide-react';
import { apiClient, AppStateResponse } from '../apiClient';
import { BackupPayload, CourseKey } from '../domain/types';
import { getEffectiveTodayIso } from '../domain/dates';
import { ThemeName } from '../ui/theme';

interface SettingsViewProps {
  state: AppStateResponse;
  onRefreshState: (nextState: AppStateResponse) => void;
  theme?: ThemeName;
  onToggleTheme?: () => void;
  onUpdateSimulatedDate?: (dateIso: string) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onRefreshState,
  theme = 'dark',
  onToggleTheme,
  onUpdateSimulatedDate,
}) => {
  const [maxWeeklyMin, setMaxWeeklyMin] = useState<number>(state.settings.max_weekly_minutes);
  const [holidayWeeklyMin, setHolidayWeeklyMin] = useState<number>(
    state.settings.holiday_weekly_minutes
  );
  const [clfDate, setClfDate] = useState<string>(state.settings.exam_dates['CLF-C02']);
  const [deaDate, setDeaDate] = useState<string>(state.settings.exam_dates['DEA-C01']);
  const [dbtDate, setDbtDate] = useState<string>(state.settings.exam_dates.DBT);
  const [timeFactors, setTimeFactors] = useState<Record<CourseKey, number>>(
    state.settings.time_factors
  );
  const [deaMinPct, setDeaMinPct] = useState<number>(state.settings.readiness_rules.dea_min_pct);
  const [deaConsecutive, setDeaConsecutive] = useState<number>(
    state.settings.readiness_rules.dea_consecutive
  );

  // Sauvegarde / Restauration JSON
  const [lastExportedJson, setLastExportedJson] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [backupMessage, setBackupMessage] = useState<string>('');
  const [backupError, setBackupError] = useState<string>('');
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextState = await apiClient.saveSettings({
      max_weekly_minutes: maxWeeklyMin,
      holiday_weekly_minutes: holidayWeeklyMin,
      exam_dates: {
        'CLF-C02': clfDate,
        'DEA-C01': deaDate,
        DBT: dbtDate,
      },
      time_factors: timeFactors,
      readiness_rules: {
        ...state.settings.readiness_rules,
        dea_min_pct: deaMinPct,
        dea_consecutive: deaConsecutive,
      },
    });
    onRefreshState(nextState);
    setBackupMessage('Réglages enregistrés.');
  };

  const handleExportBackup = async () => {
    setBackupError('');
    const payload: BackupPayload = await apiClient.exportBackup();
    const formatted = JSON.stringify(payload, null, 2);
    setLastExportedJson(formatted);
    setImportJsonText(formatted);

    // Declencher egalement le telechargement d'un fichier JSON date
    const dateStamp = payload.exported_at.slice(0, 10);
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde-prep-cdi-${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const refreshed = await apiClient.fetchState();
    onRefreshState(refreshed);
    setBackupMessage(`Sauvegarde JSON datée exportée (${payload.exported_at}).`);
  };

  const handleImportBackupFromText = async () => {
    setBackupError('');
    setBackupMessage('');
    try {
      const parsed = JSON.parse(importJsonText);
      const nextState = await apiClient.importBackup(parsed);
      onRefreshState(nextState);
      setBackupMessage('Sauvegarde restaurée avec succès après validation du schéma v1.');
    } catch (err) {
      setBackupError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleImportFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setImportJsonText(text);
    setBackupError('');
    try {
      const parsed = JSON.parse(text);
      const nextState = await apiClient.importBackup(parsed);
      onRefreshState(nextState);
      setBackupMessage(`Fichier ${file.name} restauré avec succès.`);
    } catch (err) {
      setBackupError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleResetAll = async () => {
    const nextState = await apiClient.resetAllData();
    onRefreshState(nextState);
    setConfirmReset(false);
    setBackupMessage(
      'Toutes les données utilisateur ont été supprimées : tu repars de 0 % sur tous les cours.'
    );
  };

  const isBackupOverdue = (() => {
    if (!state.settings.last_backup_at) return true;
    const diffMs = Date.now() - new Date(state.settings.last_backup_at).getTime();
    return diffMs > 7 * 24 * 60 * 60 * 1000;
  })();

  const todayIso = getEffectiveTodayIso(state.settings);

  return (
    <div data-testid="settings-view" className="stack" style={{ maxWidth: '920px' }}>
      {backupMessage && (
        <div data-testid="backup-success-msg" className="alert alert-success" role="status">
          {backupMessage}
        </div>
      )}
      {backupError && (
        <div data-testid="backup-error-msg" className="alert alert-danger" role="alert">
          {backupError}
        </div>
      )}

      {/* Affichage */}
      <section className="card" aria-labelledby="settings-display">
        <h2 id="settings-display" className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
          <Palette size={18} aria-hidden /> Affichage
        </h2>
        <div className="segmented" role="group" aria-label="Thème" style={{ display: 'inline-flex' }}>
          <button type="button" className="segment" aria-pressed={theme === 'dark'} onClick={() => theme !== 'dark' && onToggleTheme?.()} data-testid="theme-dark">
            <Moon size={16} aria-hidden /> Sombre
          </button>
          <button type="button" className="segment" aria-pressed={theme === 'light'} onClick={() => theme !== 'light' && onToggleTheme?.()} data-testid="theme-light">
            <Sun size={16} aria-hidden /> Clair
          </button>
        </div>
        <p className="muted small" style={{ margin: '0.6rem 0 0' }}>Le choix est mémorisé sur cet appareil.</p>
      </section>

      {/* Date du jour */}
      <section className="card" aria-labelledby="settings-date">
        <h2 id="settings-date" className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
          <CalendarDays size={18} aria-hidden /> Date du jour
        </h2>
        <div className="cluster">
          <label className="field" htmlFor="simulated-date-input">
            Date utilisée par le planning
            <input
              id="simulated-date-input"
              type="date"
              data-testid="simulated-date-input"
              value={todayIso}
              onChange={(e) => onUpdateSimulatedDate?.(e.target.value)}
            />
          </label>
          {state.settings.simulated_today ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-testid="reset-simulated-date"
              onClick={() => onUpdateSimulatedDate?.('')}
              style={{ alignSelf: 'flex-end' }}
            >
              Revenir à la date réelle
            </button>
          ) : null}
        </div>
        <p className="muted small" style={{ margin: '0.6rem 0 0' }}>
          Utile pour prévisualiser une semaine future. Laisse la date réelle pour un usage normal.
        </p>
      </section>

      {/* Sauvegarde */}
      <section className="card" aria-labelledby="settings-backup">
        <div className="card-header">
          <h2 id="settings-backup" className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Database size={18} aria-hidden /> Sauvegarde de mes données
          </h2>
          <span className={`badge ${isBackupOverdue ? 'badge-warning' : 'badge-success'}`} data-testid="backup-status-badge">
            {state.settings.last_backup_at
              ? `Dernière sauvegarde : ${state.settings.last_backup_at.slice(0, 16).replace('T', ' ')}`
              : 'Aucune sauvegarde récente'}
          </span>
        </div>
        <p className="text-secondary small" style={{ marginTop: 0 }}>
          Tes données sont enregistrées automatiquement. Exporte une copie de temps en temps (une fois par semaine) pour pouvoir la restaurer.
        </p>
        <div className="cluster" style={{ marginBottom: '1rem' }}>
          <button type="button" data-testid="btn-export-backup" className="btn btn-primary" onClick={handleExportBackup}>
            <Download size={16} aria-hidden />
            Exporter mes données
          </button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} aria-hidden />
            Importer un fichier
            <input
              type="file"
              data-testid="input-import-backup-file"
              accept=".json,application/json"
              onChange={handleImportFileUpload}
              className="sr-only"
            />
          </label>
        </div>
        <details className="disclosure">
          <summary>Restaurer à partir d'un texte JSON</summary>
          <div className="disclosure-body stack-sm">
            <label className="field" htmlFor="backup-json-textarea">
              Contenu JSON de la sauvegarde
              <textarea
                id="backup-json-textarea"
                data-testid="backup-json-textarea"
                rows={6}
                className="mono"
                placeholder="Exporte tes données ou colle ici un JSON de sauvegarde"
                value={importJsonText || lastExportedJson}
                onChange={(e) => setImportJsonText(e.target.value)}
                style={{ width: '100%', fontSize: '0.8rem' }}
              />
            </label>
            <div>
              <button
                type="button"
                data-testid="btn-restore-from-textarea"
                className="btn btn-success btn-sm"
                disabled={!(importJsonText || lastExportedJson).trim()}
                onClick={handleImportBackupFromText}
              >
                Restaurer cette sauvegarde
              </button>
            </div>
          </div>
        </details>
      </section>

      {/* Paramètres du planning */}
      <section className="card" aria-labelledby="settings-planning">
        <h2 id="settings-planning" className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
          <SlidersHorizontal size={18} aria-hidden /> Paramètres du planning
        </h2>
        <form onSubmit={handleSaveSettings} data-testid="settings-form" className="stack">
          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="eyebrow" style={{ marginBottom: '0.5rem' }}>Charge hebdomadaire</legend>
            <div className="grid-3" style={{ gap: '0.75rem' }}>
              <label className="field">
                Plafond normal (minutes)
                <input type="number" min={240} max={720} value={maxWeeklyMin} onChange={(e) => setMaxWeeklyMin(Number(e.target.value))} />
              </label>
              <label className="field">
                Plafond semaine allégée (minutes)
                <input type="number" min={120} max={480} value={holidayWeeklyMin} onChange={(e) => setHolidayWeeklyMin(Number(e.target.value))} />
              </label>
            </div>
          </fieldset>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="eyebrow" style={{ marginBottom: '0.5rem' }}>Dates d'examen</legend>
            <div className="grid-3" style={{ gap: '0.75rem' }}>
              <label className="field">
                AWS CLF-C02
                <input type="date" value={clfDate} onChange={(e) => setClfDate(e.target.value)} />
              </label>
              <label className="field">
                dbt Analytics Engineering
                <input type="date" value={dbtDate} onChange={(e) => setDbtDate(e.target.value)} />
              </label>
              <label className="field">
                AWS DEA-C01
                <input type="date" value={deaDate} onChange={(e) => setDeaDate(e.target.value)} />
              </label>
            </div>
          </fieldset>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="eyebrow" style={{ marginBottom: '0.5rem' }}>Règle « prêt » pour DEA-C01</legend>
            <div className="grid-3" style={{ gap: '0.75rem' }}>
              <label className="field">
                Score minimum aux blancs (%)
                <input type="number" min={60} max={95} value={deaMinPct} onChange={(e) => setDeaMinPct(Number(e.target.value))} />
              </label>
              <label className="field">
                Nombre de blancs consécutifs
                <input type="number" min={1} max={5} value={deaConsecutive} onChange={(e) => setDeaConsecutive(Number(e.target.value))} />
              </label>
            </div>
          </fieldset>

          <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend className="eyebrow" style={{ marginBottom: '0.5rem' }}>Facteur de temps par cours Udemy</legend>
            <div className="grid-4" style={{ gap: '0.75rem' }}>
              {(['merico', 'toth', 'weigel', 'maarek', 'nikolai'] as CourseKey[]).map((key) => (
                <label key={key} className="field" style={{ textTransform: 'capitalize' }}>
                  {key}
                  <input
                    type="number"
                    step={0.05}
                    min={1.0}
                    max={2.5}
                    value={timeFactors[key]}
                    onChange={(e) => setTimeFactors({ ...timeFactors, [key]: Number(e.target.value) })}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <button type="submit" data-testid="btn-save-settings" className="btn btn-primary">
              Enregistrer les réglages
            </button>
          </div>
        </form>
      </section>

      {/* Zone sensible */}
      <section className="card" aria-labelledby="settings-danger" style={{ borderColor: 'var(--danger-border)' }}>
        <h2 id="settings-danger" className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
          <TriangleAlert size={18} aria-hidden /> Données de démonstration et réinitialisation
        </h2>
        <p className="text-secondary small" style={{ marginTop: 0 }}>
          Les données de démonstration servent à tester l'application. La réinitialisation efface toute ta progression.
        </p>
        <div className="cluster">
          {!state.hasDemoData ? (
            <button
              type="button"
              data-testid="btn-load-demo"
              className="btn btn-secondary"
              onClick={async () => {
                const next = await apiClient.loadDemoData();
                onRefreshState(next);
                setBackupMessage('Données de démonstration chargées.');
              }}
            >
              Charger des données de démo
            </button>
          ) : (
            <button
              type="button"
              data-testid="btn-clear-demo"
              className="btn btn-warning"
              onClick={async () => {
                const next = await apiClient.clearDemoData();
                onRefreshState(next);
                setBackupMessage('Données de démonstration supprimées.');
              }}
            >
              Supprimer les données de démo
            </button>
          )}

          {!confirmReset ? (
            <button type="button" data-testid="btn-request-reset" className="btn btn-danger" onClick={() => setConfirmReset(true)}>
              Tout réinitialiser
            </button>
          ) : (
            <span className="cluster" role="group" aria-label="Confirmer la réinitialisation">
              <button type="button" data-testid="btn-confirm-reset" className="btn btn-danger" onClick={handleResetAll}>
                Confirmer : tout effacer
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(false)}>
                Annuler
              </button>
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
