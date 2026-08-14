# AniBot — Unified Anime & Manga Discovery Platform

AniBot is a clean, modern discovery platform for Anime, Manga, Quotes, and Trivia built with React, TypeScript, and a unified multi-provider REST API data layer.

👉 **[Visit Now (Live Demo)](https://singhadityahere.github.io/AniBot/)**

---

## Features

- **Unified Discover Portal**: Explore trending anime, currently airing shows, upcoming seasons, and top-rated manga series in one place.
- **Anime ↔ Manga Ecosystem**: Intelligent cross-references linking anime series to their original manga source material and vice-versa.
- **Unified Global Search**: Concurrent typeahead search across both Anime and Manga with tabs, debouncing, and exact-match prioritization.
- **Command Palette (`Ctrl + K`)**: Instant keyboard-driven navigation across all sections and quick actions.
- **Personal Library**: Manage your reading & watchlist with categories (Favourited, Watching, Reading, Plan to Watch/Read, Completed) and Grid/List view modes.
- **Surprise Me Engine**: Random anime and manga pick generator when you can't decide what to explore next.
- **Daily Quotes & Trivia**: Inspirational quotes and facts with one-click refresh and copy actions.
- **Client-Side API Fallback Engine**: Resilient fetching with exponential backoff retries handling rate limits (HTTP 429) for zero-backend static deployment on GitHub Pages.
- **Theme System**: Sleek Apple-inspired light and dark mode with persistent settings.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router v6, TanStack Query, Lucide Icons
- **Data Engine**: Direct browser API client fetching from Jikan (MyAnimeList v4), Kitsu API, MangaDex API, AnimeChan API, and Anime Facts API
- **Optional Backend**: Node.js, Express, Prisma ORM, SQLite (for local backend development)

## Local Development

```bash
# Clone repository
git clone https://github.com/SinghAdityaHere/AniBot.git
cd AniBot

# Install dependencies
npm install

# Start local dev server
npm run dev
```

- Frontend SPA: http://localhost:3000
- Backend REST API (Optional): http://localhost:3001

---

## Project Preview

![AniBot Dashboard Preview](./docs/preview1.png)

![AniBot Manga Explorer Preview](./docs/preview2.png)
