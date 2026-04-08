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
  const [preferenceState, setPreferenceState] = useState<ThemePreference>(() =>
    getStorageItem(STORAGE_KEYS.LIGHT_DARK_MODE, null)
  );

  const getSystemTheme = (): Theme =>  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const theme: ThemePreference = preferenceState || getSystemTheme();

  const setPreference = (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    setStorageItem(STORAGE_KEYS.LIGHT_DARK_MODE, newPreference);
  };

  const toggleTheme = () => {
    if (preferenceState === 'light') {
      setPreference('dark');
    } else if (preferenceState === 'dark') {
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
    if (preferenceState !== null) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', ()=>setPreferenceState(null));
    return () => mediaQuery.removeEventListener('change', ()=>setPreferenceState(null));
  }, [preferenceState]);

  return (
    <ThemeContext.Provider value={{ theme, preference: preferenceState, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};