import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';
import { Home } from './pages/Home';
import { SearchPage } from './pages/Search';
import { AnimeDetailPage } from './pages/AnimeDetail';
import { MangaExplorerPage } from './pages/MangaExplorer';
import { MangaDetailPage } from './pages/MangaDetail';
import { FavouritesPage } from './pages/Favourites';
import { RecentSearchesPage } from './pages/RecentSearches';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="app-shell">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/manga" element={<MangaExplorerPage />} />
              <Route path="/manga/:id" element={<MangaDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/recent-searches" element={<RecentSearchesPage />} />
            </Routes>
          </main>
          <MobileNav />
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
