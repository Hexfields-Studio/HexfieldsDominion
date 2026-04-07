import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "../constants/storage";

type Theme = 'light' | 'dark';

type ThemePreference = Theme | null; // null means follow system

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    getStorageItem(STORAGE_KEYS.LIGHT_DARK_MODE, null)
  );

  const getSystemTheme = (): Theme => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const theme = preference || getSystemTheme();

  const setPreference = (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    setStorageItem(STORAGE_KEYS.LIGHT_DARK_MODE, newPreference);
  };

  const toggleTheme = () => {
    if (preference === 'light') {
      setPreference('dark');
    } else if (preference === 'dark') {
      setPreference('light');
    } else {
      // If system, toggle to opposite of current system
      setPreference(theme === 'light' ? 'dark' : 'light');
    }
  };

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for system theme changes if preference is null
  useEffect(() => {
    if (preference !== null) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render by updating state, but since preference is null, theme will update
      setPreferenceState(null);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};