// Early theme initialization (shadcn-style). Loaded from index.html before main bundle.
const storageKey = 'ui-theme';

function applyTheme(theme: 'light' | 'dark') {
  const classList = document.documentElement.classList;
  if (theme === 'dark') classList.add('dark');
  else classList.remove('dark');
}

function getStoredTheme(): 'light' | 'dark' | null {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

const stored = getStoredTheme();
if (stored) {
  applyTheme(stored);
} else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}


