import { onMounted, onUnmounted } from 'vue';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = ThemeMode | 'system';

const STORAGE_KEY = 'haisanlagi_theme';

export function useTheme() {
  const theme = useState<ThemeMode>('theme', () => 'light'); // effective applied theme
  const preference = useState<ThemePreference>('theme_preference', () => 'system');
  let mediaQuery: MediaQueryList | null = null;

  const resolveSystemTheme = (): ThemeMode => {
    if (!process.client) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (mode: ThemePreference) => {
    preference.value = mode;
    const target = mode === 'system' ? resolveSystemTheme() : mode;
    theme.value = target;

    if (!process.client) return;

    const root = document.documentElement;
    root.classList.toggle('dark', target === 'dark');
    root.dataset.theme = target;
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const toggleTheme = () => {
    const next =
      preference.value === 'system'
        ? theme.value === 'dark'
          ? 'light'
          : 'dark'
        : preference.value === 'dark'
          ? 'light'
          : 'dark';
    applyTheme(next);
  };

  onMounted(() => {
    if (!process.client) return;
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    const initialPreference = stored || 'system';
    applyTheme(initialPreference);

    // Re-apply when system preference changes and user is in system mode
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preference.value === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);

    onUnmounted(() => {
      mediaQuery?.removeEventListener('change', handleChange);
    });
  });

  return {
    theme,
    preference,
    applyTheme,
    toggleTheme
  };
}
