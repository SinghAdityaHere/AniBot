import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';
import { CommandPalette } from './components/ui/CommandPalette';
import { Home } from './pages/Home';
import { DiscoverPage } from './pages/Discover';
import { SearchPage } from './pages/Search';
import { AnimeDetailPage } from './pages/AnimeDetail';
import { MangaExplorerPage } from './pages/MangaExplorer';
import { MangaDetailPage } from './pages/MangaDetail';
import { LibraryPage } from './pages/Library';
import { RecentSearchesPage } from './pages/RecentSearches';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppContent: React.FC = () => {
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-shell">
      <Header onOpenCommandPalette={() => setIsCmdOpen(true)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/manga" element={<MangaExplorerPage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/favourites" element={<LibraryPage />} />
          <Route path="/recent-searches" element={<RecentSearchesPage />} />
        </Routes>
      </main>
      <MobileNav />
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
