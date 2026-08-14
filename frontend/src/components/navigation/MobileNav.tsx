import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="mobile-nav-bar">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={20} />
        <span>Anime</span>
      </Link>
      <Link to="/manga" className={`mobile-nav-item ${isActive('/manga') ? 'active' : ''}`}>
        <BookOpen size={20} />
        <span>Manga</span>
      </Link>
      <Link to="/favourites" className={`mobile-nav-item ${isActive('/favourites') ? 'active' : ''}`}>
        <Heart size={20} />
        <span>Favs</span>
      </Link>
    </nav>
  );
};
