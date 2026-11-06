import React, { useEffect, useState } from 'react';
import { fetchProjectSheets, updateProjectSheet } from '../apiClient';
import { ProjectSheet } from '../domain/types';

interface ProjectsViewProps {
  initialProjectId?: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ initialProjectId }) => {
  const [projects, setProjects] = useState<ProjectSheet[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || 'proj-1');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Formulaire d edition de la fiche courante
  const [formData, setFormData] = useState<ProjectSheet>({
    id: 'proj-1',
    title: '',
    target_role: 'Data Engineer',
    pitch_star_situation: '',
    pitch_star_task: '',
    pitch_star_action: '',
    pitch_star_result: '',
    tech_stack: [],
    architecture_points: [],
    trap_questions: [],
    updated_at: '',
  });

  // Nouveau tag / nouvelle question piege
  const [newTag, setNewTag] = useState<string>('');
  const [newArchPoint, setNewArchPoint] = useState<string>('');
  const [newTrapQ, setNewTrapQ] = useState<string>('');
  const [newTrapA, setNewTrapA] = useState<string>('');

  useEffect(() => {
    fetchProjectSheets()
      .then((sheets) => {
        setProjects(sheets);
        if (sheets.length > 0) {
          const target =
            (initialProjectId && sheets.find((s) => s.id === initialProjectId)) || sheets[0];
          setSelectedProjectId(target.id);
          setFormData(target);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (initialProjectId && projects.length > 0) {
      const target = projects.find((s) => s.id === initialProjectId);
      if (target) {
        setSelectedProjectId(target.id);
        setFormData(target);
        setSaveSuccess(false);
      }
    }
  }, [initialProjectId, projects]);

  const handleSelectProject = (sheet: ProjectSheet) => {
    setSelectedProjectId(sheet.id);
    setFormData(sheet);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await updateProjectSheet(formData);
      if (res.success && res.project) {
        setProjects((prev) => prev.map((p) => (p.id === res.project.id ? res.project : p)));
        setFormData(res.project);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert('Erreur lors de la sauvegarde : ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!formData.tech_stack.includes(newTag.trim())) {
      setFormData({ ...formData, tech_stack: [...formData.tech_stack, newTag.trim()] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddArchPoint = () => {
    if (!newArchPoint.trim()) return;
    setFormData({
      ...formData,
      architecture_points: [...formData.architecture_points, newArchPoint.trim()],
    });
    setNewArchPoint('');
  };

  const handleRemoveArchPoint = (idx: number) => {
    setFormData({
      ...formData,
      architecture_points: formData.architecture_points.filter((_, i) => i !== idx),
    });
  };

  const handleAddTrapQuestion = () => {
    if (!newTrapQ.trim()) return;
    setFormData({
      ...formData,
      trap_questions: [
        ...formData.trap_questions,
        { question: newTrapQ.trim(), answer: newTrapA.trim() },
      ],
    });
    setNewTrapQ('');
    setNewTrapA('');
  };

  const handleRemoveTrapQuestion = (idx: number) => {
    setFormData({
      ...formData,
      trap_questions: formData.trap_questions.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p className="muted">Chargement des fiches projets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callout callout-warning">
        <h3 style={{ margin: '0 0 0.5rem 0' }}>Erreur</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* En-tete */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💼</span>
              <span>Espace Projets STAR (Preparation aux Entretiens)</span>
            </h2>
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Structure tes 3 projets d alternance et d ecole avec la methode STAR pour convaincre en entretien d embauche.
            </div>
          </div>

          {/* Onglets des 3 fiches de projet */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {projects.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectProject(p)}
                className={`btn btn-sm ${selectedProjectId === p.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                Projet {idx + 1} {p.title ? `: ${p.title.slice(0, 20)}...` : '(A remplir)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide methodologique */}
      <div className="callout callout-info" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
        <div style={{ fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>💡</span> Conseil pour un ingenieur EPITA en alternance :
        </div>
        <p style={{ margin: 0 }}>
          Un bon recruteur ou Tech Lead ne cherche pas a savoir si tu as tout fait tout seul : il cherche a comprendre{' '}
          <strong>ton perimetre exact de responsabilite</strong>, tes choix techniques et <strong>l impact chiffre</strong>{' '}
          de tes realisations (ex : « 50M evenements/jour traites », « temps d execution passe de 45 min a 6 min », « couts reduits de 30 % »).
        </p>
      </div>

      {/* Formulaire STAR */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Identifiants et role */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <label className="muted" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Titre du projet :
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex : Modernisation de la plateforme analytique Snowflake & dbt"
              className="input"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            />
          </div>

          <div>
            <label className="muted" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Role vise :
            </label>
            <select
              value={formData.target_role}
              onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
              className="select"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="Data Engineer">Data Engineer (Priorite 1)</option>
              <option value="AI Engineer">AI Engineer (Priorite 2)</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
          </div>
        </div>

        {/* Grille STAR (4 sections) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎯</span> La Trame STAR Detaillee
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {/* Situation */}
            <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                  [S] Situation : Le Contexte
                </span>
                <span className="muted" style={{ fontSize: '0.72rem' }}>Entreprise, equipe, enjeu</span>
              </div>
              <textarea
                value={formData.pitch_star_situation}
                onChange={(e) => setFormData({ ...formData, pitch_star_situation: e.target.value })}
                rows={4}
                placeholder="Quel etait le contexte d alternance ? Quel etait le volume de donnees ou le metier concerne ?"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.82rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Task */}
            <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                  [T] Task : La Problematique & Objectifs
                </span>
                <span className="muted" style={{ fontSize: '0.72rem' }}>Defi technique a resoudre</span>
              </div>
              <textarea
                value={formData.pitch_star_task}
                onChange={(e) => setFormData({ ...formData, pitch_star_task: e.target.value })}
                rows={4}
                placeholder="Quels etaient tes objectifs precis et les contraintes (delais, scalabilite, SLA, securite) ?"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.82rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Action */}
            <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase' }}>
                  [A] Action : Ton Implementation & Decisions
                </span>
                <span className="muted" style={{ fontSize: '0.72rem' }}>Ce que TU as concu et developpe</span>
              </div>
              <textarea
                value={formData.pitch_star_action}
                onChange={(e) => setFormData({ ...formData, pitch_star_action: e.target.value })}
                rows={4}
                placeholder="Quelles technologies as-tu choisies et pourquoi ? Quels arbitrages d architecture as-tu faits ?"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.82rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Result */}
            <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase' }}>
                  [R] Result : Les Metriques Chiffrees & Impact
                </span>
                <span className="muted" style={{ fontSize: '0.72rem' }}>Chiffres, ROI, performance</span>
              </div>
              <textarea
                value={formData.pitch_star_result}
                onChange={(e) => setFormData({ ...formData, pitch_star_result: e.target.value })}
                rows={4}
                placeholder="Quels sont les gains mesurables ? (Gains de temps, fiabilite a 99.9%, volumes traites, utilisateurs satisfaits)"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.82rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* Stack technique */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="muted" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Technologies & Outils Employes :
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            {formData.tech_stack.map((t) => (
              <span
                key={t}
                className="badge badge-neutral mono"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.5rem' }}
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                >
                  ×
                </button>
              </span>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="+ Ajouter un outil (ex: Snowflake, dbt)"
                className="input"
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.78rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Points d architecture cles */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="muted" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Points d Architecture Cles a Defendre :
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {formData.architecture_points.map((pt, idx) => (
              <div
                key={idx}
                className="row-between"
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--text-secondary)' }}>{pt}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArchPoint(idx)}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.72rem', color: 'var(--accent-red)', padding: '0.15rem 0.4rem' }}
                >
                  Supprimer
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                type="text"
                value={newArchPoint}
                onChange={(e) => setNewArchPoint(e.target.value)}
                placeholder="Ex : Partitionnement par date sur S3 + table Iceberg pour isolation ACID"
                className="input"
                style={{
                  flex: 1,
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                onClick={handleAddArchPoint}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.78rem' }}
              >
                + Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Questions pieges anticipees */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <label className="muted" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Questions Pieges Anticipees par les Recruteurs & Reponses :
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {formData.trap_questions.map((tq, idx) => (
              <div key={idx} className="callout callout-warning" style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div className="row-between" style={{ alignItems: 'flex-start' }}>
                  <strong style={{ color: 'var(--accent-amber)' }}>Q : {tq.question}</strong>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrapQuestion(idx)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.72rem', color: 'var(--accent-red)', padding: '0.15rem 0.4rem' }}
                  >
                    Supprimer
                  </button>
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>R : {tq.answer}</div>
              </div>
            ))}

            <div className="card" style={{ padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                value={newTrapQ}
                onChange={(e) => setNewTrapQ(e.target.value)}
                placeholder="Question piege (ex : Pourquoi ne pas avoir utilise Spark plutot que dbt ?)"
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                }}
              />
              <textarea
                value={newTrapA}
                onChange={(e) => setNewTrapA(e.target.value)}
                rows={2}
                placeholder="Ta reponse argumentee avec compromis clairs..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                }}
              />
              <div>
                <button
                  type="button"
                  onClick={handleAddTrapQuestion}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.78rem' }}
                >
                  + Enregistrer cette question piege
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="row-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="muted" style={{ fontSize: '0.78rem' }}>
            {formData.updated_at && `Derniere mise a jour : ${new Date(formData.updated_at).toLocaleString()}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {saveSuccess && (
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>✓</span> Fiche sauvegardee avec succes !
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Sauvegarde en cours...' : '💾 Sauvegarder ce projet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
