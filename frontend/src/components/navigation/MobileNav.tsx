import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, History } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="mobile-nav-bar">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/search" className={`mobile-nav-item ${isActive('/search') ? 'active' : ''}`}>
        <Search size={20} />
        <span>Search</span>
      </Link>
      <Link to="/favourites" className={`mobile-nav-item ${isActive('/favourites') ? 'active' : ''}`}>
        <Heart size={20} />
        <span>Favourites</span>
      </Link>
      <Link to="/recent-searches" className={`mobile-nav-item ${isActive('/recent-searches') ? 'active' : ''}`}>
        <History size={20} />
        <span>Recent</span>
      </Link>
    </nav>
  );
};
