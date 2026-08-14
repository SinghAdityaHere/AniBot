import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-bar">
      <div className="header-container">
        <Link to="/" className="logo-brand" aria-label="AniBot Home">
          <Sparkles size={24} color="var(--color-accent)" />
          Ani<span>Bot</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Explore
          </Link>
          <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
            Search
          </Link>
          <Link to="/favourites" className={`nav-link ${isActive('/favourites') ? 'active' : ''}`}>
            Favourites
          </Link>
          <Link to="/recent-searches" className={`nav-link ${isActive('/recent-searches') ? 'active' : ''}`}>
            History
          </Link>

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#F59E0B" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
