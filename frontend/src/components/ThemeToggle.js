import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme() || { theme: 'light', toggleTheme: () => {} };
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/60 text-gray-700 dark:text-gray-100 hover:shadow-md transition"
      aria-label="Toggle color theme"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      {isDark ? 'Dark' : 'Light'} mode
    </button>
  );
};

export default ThemeToggle;


