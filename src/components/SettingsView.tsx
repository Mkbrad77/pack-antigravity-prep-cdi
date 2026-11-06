import React, { useState } from 'react';
import { apiClient, AppStateResponse } from '../apiClient';
import { BackupPayload, CourseKey } from '../domain/types';

interface SettingsViewProps {
  state: AppStateResponse;
  onRefreshState: (nextState: AppStateResponse) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ state, onRefreshState }) => {
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
    setBackupMessage('Réglages enregistrés dans SQLite avec succès.');
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
      'Toutes les données utilisateur ont été supprimées et l\'état initial du 31 octobre 2026 a été restauré.'
    );
  };

  const isBackupOverdue = (() => {
    if (!state.settings.last_backup_at) return true;
    const diffMs = Date.now() - new Date(state.settings.last_backup_at).getTime();
    return diffMs > 7 * 24 * 60 * 60 * 1000;
  })();

  return (
    <div data-testid="settings-view">
      {/* Sauvegarde, Restauration, Donnees DEMO et Reinitialisation */}
      <div className="card" style={{ marginBottom: '1rem', borderColor: 'var(--accent)' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
              Sauvegarde locale SQLite et Export / Restauration JSON datée
            </h2>
            <p className="muted" style={{ margin: '0.2rem 0 0 0', fontSize: '0.84rem' }}>
              Fichier SQLite actif : <code className="mono">{state.dbPath}</code>
            </p>
          </div>
          <span
            className={`badge ${isBackupOverdue ? 'badge-warning' : 'badge-success'}`}
            data-testid="backup-status-badge"
          >
            {state.settings.last_backup_at
              ? `Dernière sauvegarde : ${state.settings.last_backup_at.slice(0, 19).replace('T', ' ')}`
              : 'Rappel : aucune sauvegarde JSON exportée récemment'}
          </span>
        </div>

        {backupMessage && (
          <div
            data-testid="backup-success-msg"
            className="alert alert-success"
            style={{ marginBottom: '0.75rem' }}
          >
            {backupMessage}
          </div>
        )}
        {backupError && (
          <div
            data-testid="backup-error-msg"
            className="alert alert-danger"
            style={{ marginBottom: '0.75rem' }}
          >
            {backupError}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button
            type="button"
            data-testid="btn-export-backup"
            className="btn btn-primary"
            onClick={handleExportBackup}
          >
            Exporter mes données (JSON daté)
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            Importer un fichier JSON
            <input
              type="file"
              data-testid="input-import-backup-file"
              accept=".json,application/json"
              onChange={handleImportFileUpload}
              style={{ display: 'none' }}
            />
          </label>

          {!state.hasDemoData ? (
            <button
              type="button"
              data-testid="btn-load-demo"
              className="btn btn-secondary"
              onClick={async () => {
                const next = await apiClient.loadDemoData();
                onRefreshState(next);
                setBackupMessage('Données étiquetées [DÉMO] chargées.');
              }}
            >
              Charger des données [DÉMO]
            </button>
          ) : (
            <button
              type="button"
              data-testid="btn-clear-demo"
              className="btn btn-warning"
              onClick={async () => {
                const next = await apiClient.clearDemoData();
                onRefreshState(next);
                setBackupMessage('Données [DÉMO] supprimées en un clic.');
              }}
            >
              Supprimer les données [DÉMO] en un clic
            </button>
          )}

          {!confirmReset ? (
            <button
              type="button"
              data-testid="btn-request-reset"
              className="btn btn-danger"
              onClick={() => setConfirmReset(true)}
            >
              Tout supprimer / Réinitialiser
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                type="button"
                data-testid="btn-confirm-reset"
                className="btn btn-danger"
                onClick={handleResetAll}
              >
                Confirmer la suppression totale
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setConfirmReset(false)}
              >
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Zone d'inspection et de restauration directe du JSON */}
        <div className="grid-2" style={{ gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              Contenu JSON de sauvegarde (éditable ou collable pour restauration directe) :
            </label>
            <textarea
              data-testid="backup-json-textarea"
              rows={6}
              className="mono"
              placeholder="Cliquez sur « Exporter mes données » ou collez ici un JSON de sauvegarde..."
              value={importJsonText || lastExportedJson}
              onChange={(e) => setImportJsonText(e.target.value)}
              style={{ width: '100%', marginTop: '0.3rem', fontSize: '0.78rem' }}
            />
            <button
              type="button"
              data-testid="btn-restore-from-textarea"
              className="btn btn-success btn-sm"
              style={{ marginTop: '0.4rem' }}
              disabled={!(importJsonText || lastExportedJson).trim()}
              onClick={handleImportBackupFromText}
            >
              Restaurer cette sauvegarde JSON maintenant
            </button>
          </div>

          <div className="card card-sm">
            <h4 style={{ marginTop: 0 }}>
              Architecture Web Workers (Préparation Phases 3 et 4)
            </h4>
            <p className="muted" style={{ fontSize: '0.82rem' }}>
              Les ponts asynchrones Web Worker sont en place pour accueillir les bacs à sable
              locaux sans bloquer le thread principal :
            </p>
            <ul style={{ fontSize: '0.82rem', paddingLeft: '1.2rem' }}>
              <li>
                <strong>SQL (DuckDB-WASM) :</strong> statut{' '}
                <code className="mono">{state.workersStatus['duckdb-wasm']?.phaseStatus}</code> (
                {state.workersStatus['duckdb-wasm']?.descriptionFr})
              </li>
              <li>
                <strong>Python (Pyodide) :</strong> statut{' '}
                <code className="mono">{state.workersStatus.pyodide?.phaseStatus}</code> (
                {state.workersStatus.pyodide?.descriptionFr})
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulaire de reglages des budgets, facteurs de temps et dates d'examen */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          Paramètres du planning, facteurs de temps par cours et dates d'examens
        </h3>
        <form onSubmit={handleSaveSettings} data-testid="settings-form">
          <div className="grid-3" style={{ gap: '0.75rem', marginBottom: '0.85rem' }}>
            <label>
              Plafond hebdomadaire normal (min, défaut 600 = 10h) :
              <input
                type="number"
                min={240}
                max={720}
                value={maxWeeklyMin}
                onChange={(e) => setMaxWeeklyMin(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.2rem' }}
              />
            </label>
            <label>
              Plafond semaine allégée / fêtes (min, défaut 360 = 6h) :
              <input
                type="number"
                min={120}
                max={480}
                value={holidayWeeklyMin}
                onChange={(e) => setHolidayWeeklyMin(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.2rem' }}
              />
            </label>
            <label>
              Règle DEA-C01 « Prêt » (% min / blancs consécutifs) :
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                <input
                  type="number"
                  min={60}
                  max={95}
                  value={deaMinPct}
                  onChange={(e) => setDeaMinPct(Number(e.target.value))}
                  style={{ width: '50%' }}
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={deaConsecutive}
                  onChange={(e) => setDeaConsecutive(Number(e.target.value))}
                  style={{ width: '50%' }}
                />
              </div>
            </label>
          </div>

          <div className="grid-3" style={{ gap: '0.75rem', marginBottom: '0.85rem' }}>
            <label>
              Date visée examen AWS CLF-C02 :
              <input
                type="date"
                value={clfDate}
                onChange={(e) => setClfDate(e.target.value)}
                style={{ width: '100%', marginTop: '0.2rem' }}
              />
            </label>
            <label>
              Date visée examen AWS DEA-C01 :
              <input
                type="date"
                value={deaDate}
                onChange={(e) => setDeaDate(e.target.value)}
                style={{ width: '100%', marginTop: '0.2rem' }}
              />
            </label>
            <label>
              Date visée examen dbt Analytics Engineering :
              <input
                type="date"
                value={dbtDate}
                onChange={(e) => setDbtDate(e.target.value)}
                style={{ width: '100%', marginTop: '0.2rem' }}
              />
            </label>
          </div>

          <h4 style={{ margin: '0.5rem 0' }}>Facteurs multiplicateurs de temps par cours Udemy :</h4>
          <div className="grid-3" style={{ gap: '0.6rem', marginBottom: '0.85rem' }}>
            {(['merico', 'maarek', 'nikolai', 'toth', 'weigel'] as CourseKey[]).map((key) => (
              <label key={key} style={{ fontSize: '0.85rem' }}>
                Cours <strong>{key}</strong> :
                <input
                  type="number"
                  step={0.05}
                  min={1.0}
                  max={2.5}
                  value={timeFactors[key]}
                  onChange={(e) =>
                    setTimeFactors({ ...timeFactors, [key]: Number(e.target.value) })
                  }
                  style={{ width: '90px', marginLeft: '0.4rem' }}
                />
              </label>
            ))}
          </div>

          <button type="submit" data-testid="btn-save-settings" className="btn btn-primary">
            Enregistrer les réglages
          </button>
        </form>
      </div>
    </div>
  );
};
