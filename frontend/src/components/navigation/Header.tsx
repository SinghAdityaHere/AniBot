import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Heart, History, Home, Search as SearchIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header-bar">
      <div className="header-container">
        <Link to="/" className="logo-brand">
          <Sparkles size={24} color="#6C63FF" />
          Ani<span>Bot</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
            Search
          </Link>
          <Link to="/favourites" className={`nav-link ${isActive('/favourites') ? 'active' : ''}`}>
            Favourites
          </Link>
          <Link to="/recent-searches" className={`nav-link ${isActive('/recent-searches') ? 'active' : ''}`}>
            Recent Searches
          </Link>
        </nav>
      </div>
    </header>
  );
};
