import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light' | 'pink' | 'neon' | 'cosmic' | 'ocean';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('highvibe-theme');
    return (saved as ThemeMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('highvibe-theme', theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'light', 'theme-pink', 'theme-neon', 'theme-cosmic', 'theme-ocean');
    
    // Add the appropriate class
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('dark', `theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
