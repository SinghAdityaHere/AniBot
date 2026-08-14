import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, Bookmark } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="mobile-nav-bar">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link to="/discover" className={`mobile-nav-item ${isActive('/discover') ? 'active' : ''}`}>
        <Compass size={20} />
        <span>Discover</span>
      </Link>
      <Link to="/manga" className={`mobile-nav-item ${isActive('/manga') ? 'active' : ''}`}>
        <BookOpen size={20} />
        <span>Manga</span>
      </Link>
      <Link to="/library" className={`mobile-nav-item ${isActive('/library') || isActive('/favourites') ? 'active' : ''}`}>
        <Bookmark size={20} />
        <span>Library</span>
      </Link>
    </nav>
  );
};
