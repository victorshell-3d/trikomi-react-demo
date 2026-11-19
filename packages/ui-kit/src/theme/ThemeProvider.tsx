import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';

export type VictorShellAccent = 'violet' | 'indigo' | 'orchid';

interface VictorShellThemeContextValue {
  accent: VictorShellAccent;
  setAccent: (accent: VictorShellAccent) => void;
}

export interface VictorShellThemeProviderProps {
  children: ReactNode;
  initialAccent?: VictorShellAccent;
  className?: string;
}

const VictorShellThemeContext = createContext<VictorShellThemeContextValue | null>(null);

export function VictorShellThemeProvider({
  children,
  initialAccent = 'violet',
  className
}: VictorShellThemeProviderProps) {
  const [accent, setAccent] = useState<VictorShellAccent>(initialAccent);
  const contextValue = useMemo(() => ({ accent, setAccent }), [accent]);
  const rootClassName = ['vs-ui-root', className].filter(Boolean).join(' ');

  return (
    <VictorShellThemeContext.Provider value={contextValue}>
      <div className={rootClassName} data-accent={accent}>
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
