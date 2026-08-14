import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Sun, Moon, Command } from 'lucide-react';
import { useTheme } from '../../stores/useThemeStore';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
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
            Home
          </Link>
          <Link to="/discover" className={`nav-link ${isActive('/discover') ? 'active' : ''}`}>
            Discover
          </Link>
          <Link to="/manga" className={`nav-link ${isActive('/manga') ? 'active' : ''}`}>
            Manga
          </Link>
          <Link to="/library" className={`nav-link ${isActive('/library') || isActive('/favourites') ? 'active' : ''}`}>
            My Library
          </Link>

          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="cmd-palette-btn"
              title="Open Command Palette (Ctrl+K)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--color-border)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
              }}
            >
              <Command size={14} /> <span>Ctrl+K</span>
            </button>
          )}

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
