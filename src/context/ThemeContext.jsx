import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

/**
 * Provides theme state and toggle functions to the entire app.
 * Supports three themes: light (default), dark, and sonia (unlocked via puzzle).
 * Persists the active theme to localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Apply theme to <html> element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const activateSoniaTheme = useCallback(() => {
    setTheme('sonia');
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, activateSoniaTheme }),
    [theme, toggleTheme, activateSoniaTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
