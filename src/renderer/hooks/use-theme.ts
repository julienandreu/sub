import { useEffect, useMemo, useState } from 'preact/hooks';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ui-theme';

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function useSystemPrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState<boolean>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches);
    };
    media.addEventListener('change', handler);
    return () => {
      media.removeEventListener('change', handler);
    };
  }, []);

  return prefersDark;
}

export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void } {
  const systemPrefersDark = useSystemPrefersDark();
  const stored = useMemo(() => readStoredTheme(), []);

  const [theme, setThemeState] = useState<Theme>(stored ?? (systemPrefersDark ? 'dark' : 'light'));
  const [hasExplicitPreference, setHasExplicitPreference] = useState<boolean>(stored !== null);

  // Apply class and persist preference
  useEffect(() => {
    const classList = document.documentElement.classList;
    if (theme === 'dark') classList.add('dark');
    else classList.remove('dark');

    if (hasExplicitPreference) {
      writeStoredTheme(theme);
    }
  }, [theme, hasExplicitPreference]);

  // Follow system when no explicit preference
  useEffect(() => {
    if (!hasExplicitPreference) {
      setThemeState(systemPrefersDark ? 'dark' : 'light');
    }
  }, [systemPrefersDark, hasExplicitPreference]);

  const setTheme = (next: Theme) => {
    setHasExplicitPreference(true);
    setThemeState(next);
  };

  return { theme, setTheme };
}


