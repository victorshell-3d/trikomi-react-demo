import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';

export type VictorShellAccent = 'violet' | 'indigo' | 'orchid';
export type VictorShellThemeMode = 'light' | 'dark';

export interface VictorShellThemeContextValue {
  accent: VictorShellAccent;
  setAccent: (accent: VictorShellAccent) => void;
  themeMode: VictorShellThemeMode;
  setThemeMode: (mode: VictorShellThemeMode) => void;
  toggleThemeMode: () => void;
  isDark: boolean;
}

export interface VictorShellThemeProviderProps {
  children: ReactNode;
  initialAccent?: VictorShellAccent;
  initialThemeMode?: VictorShellThemeMode;
  className?: string;
}

const STORAGE_KEY_MODE = 'vs_theme_mode';
const STORAGE_KEY_ACCENT = 'vs_theme_accent';

const VictorShellThemeContext = createContext<VictorShellThemeContextValue | null>(null);

function getSavedThemeMode(defaultMode: VictorShellThemeMode): VictorShellThemeMode {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_MODE);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  }
  return defaultMode;
}

function getSavedAccent(defaultAccent: VictorShellAccent): VictorShellAccent {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_ACCENT);
      if (saved === 'violet' || saved === 'indigo' || saved === 'orchid') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  return defaultAccent;
}

export function VictorShellThemeProvider({
  children,
  initialAccent = 'violet',
  initialThemeMode = 'light',
  className
}: VictorShellThemeProviderProps) {
  const [accent, setAccentState] = useState<VictorShellAccent>(() => getSavedAccent(initialAccent));
  const [themeMode, setThemeModeState] = useState<VictorShellThemeMode>(() => getSavedThemeMode(initialThemeMode));

  const setAccent = useCallback((newAccent: VictorShellAccent) => {
    setAccentState(newAccent);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY_ACCENT, newAccent);
      } catch {
        // Ignore localStorage error
      }
    }
  }, []);

  const setThemeMode = useCallback((newMode: VictorShellThemeMode) => {
    setThemeModeState(newMode);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY_MODE, newMode);
      } catch {
        // Ignore localStorage error
      }
    }
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(STORAGE_KEY_MODE, next);
        } catch {
          // Ignore localStorage error
        }
      }
      return next;
    });
  }, []);

  // Synchronize documentElement attributes to prevent flash and style global elements
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeMode);
      document.documentElement.setAttribute('data-accent', accent);
    }
  }, [themeMode, accent]);

  const isDark = themeMode === 'dark';

  const contextValue = useMemo(
    () => ({
      accent,
      setAccent,
      themeMode,
      setThemeMode,
      toggleThemeMode,
      isDark
    }),
    [accent, setAccent, themeMode, setThemeMode, toggleThemeMode, isDark]
  );

  const rootClassName = ['vs-ui-root', className].filter(Boolean).join(' ');

  return (
    <VictorShellThemeContext.Provider value={contextValue}>
      <div className={rootClassName} data-theme={themeMode} data-accent={accent}>
        {children}
      </div>
    </VictorShellThemeContext.Provider>
  );
}

export function useVictorShellTheme(): VictorShellThemeContextValue {
  const context = useContext(VictorShellThemeContext);
  if (!context) {
    throw new Error('useVictorShellTheme must be used within a VictorShellThemeProvider');
  }
  return context;
}

export function useOptionalVictorShellTheme(): VictorShellThemeContextValue | null {
  return useContext(VictorShellThemeContext);
}
