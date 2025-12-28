import { onMounted } from 'vue';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode;

const STORAGE_KEY = 'haisanlagi_theme';

export function useTheme() {
  const theme = useState<ThemeMode>('theme', () => 'light'); // effective applied theme
  const preference = useState<ThemePreference>('theme_preference', () => 'dark');

  const applyTheme = (mode: ThemePreference) => {
    preference.value = mode;
    theme.value = mode;

    if (!process.client) return;

    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.dataset.theme = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  };

  const toggleTheme = () => {
    const next = preference.value === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  onMounted(() => {
    if (!process.client) return;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    const initialPreference = stored || 'dark';
    applyTheme(initialPreference);
  });

  return {
    theme,
    preference,
    applyTheme,
    toggleTheme
  };
}
