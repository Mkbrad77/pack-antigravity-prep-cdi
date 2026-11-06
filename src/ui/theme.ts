// Thème d'affichage : sombre par défaut, clair en option.
// Le choix est mémorisé sur l'appareil (localStorage) et appliqué avant le
// premier rendu par le petit script de index.html, pour éviter tout flash.

export type ThemeName = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'prep-cdi-theme';

const THEME_COLORS: Record<ThemeName, string> = {
  dark: '#0e1116',
  light: '#f4f6f9',
};

export function readStoredTheme(): ThemeName {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: ThemeName): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
}

export function storeTheme(theme: ThemeName): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // stockage indisponible (navigation privée) : le thème reste valable pour la session
  }
  applyTheme(theme);
}
