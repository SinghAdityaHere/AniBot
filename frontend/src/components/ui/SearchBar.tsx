import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Star, ArrowUpRight, BookOpen, Tv } from 'lucide-react';
import { useAnimeSearch } from '../../api/anime';
import { useMangaSearch } from '../../api/manga';
import { Anime, Manga } from '@anibot/shared';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string, type?: 'all' | 'anime' | 'manga') => void;
  placeholder?: string;
  autoFocus?: boolean;
  searchType?: 'all' | 'anime' | 'manga';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search anime, manga, titles...',
  autoFocus = false,
  searchType = 'all',
}) => {
  const navigate = useNavigate();
  const [internalValue, setInternalValue] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce search input for suggestions (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(internalValue.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [internalValue]);

  // Fetch live search suggestions
  const activeQuery = debouncedQuery.length >= 2 ? debouncedQuery : '';
  const { data: animeSuggestions = [], isLoading: isAnimeSuggesting } = useAnimeSearch(
    searchType === 'manga' ? '' : activeQuery
  );
  const { data: mangaSuggestions = [], isLoading: isMangaSuggesting } = useMangaSearch(
    searchType === 'anime' ? '' : activeQuery
  );

  const isSuggesting = isAnimeSuggesting || isMangaSuggesting;

  // Flatten suggestions for keyboard navigation
  const allSuggestions: Array<{ type: 'anime' | 'manga'; item: Anime | Manga }> = [
    ...animeSuggestions.slice(0, 4).map((item) => ({ type: 'anime' as const, item })),
    ...mangaSuggestions.slice(0, 4).map((item) => ({ type: 'manga' as const, item })),
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global '/' hotkey to focus search bar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    setSelectedIndex(-1);
    if (onChange) onChange(val);
    setIsDropdownOpen(val.trim().length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
        e.preventDefault();
        const selected = allSuggestions[selectedIndex];
        setIsDropdownOpen(false);
        if (selected.type === 'anime') {
          navigate(`/anime/${selected.item.id}`);
        } else {
          navigate(`/manga/${selected.item.id}`);
        }
      } else if (internalValue.trim()) {
        setIsDropdownOpen(false);
        if (onSearch) {
          onSearch(internalValue.trim(), searchType);
        } else {
          navigate(`/search?q=${encodeURIComponent(internalValue.trim())}&type=${searchType}`);
        }
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    setDebouncedQuery('');
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    if (onChange) onChange('');
    if (onSearch) onSearch('', searchType);
  };

  const handleSelectMedia = (type: 'anime' | 'manga', id: string) => {
    setIsDropdownOpen(false);
    if (type === 'anime') {
      navigate(`/anime/${id}`);
    } else {
      navigate(`/manga/${id}`);
    }
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div style={{ position: 'relative' }}>
        <SearchIcon size={20} className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={internalValue}
          onChange={handleChange}
          onFocus={() => {
            if (internalValue.trim().length >= 2) setIsDropdownOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          aria-label="Search anime and manga"
        />
        <div
          style={{
            position: 'absolute',
            right: internalValue ? 44 : 18,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            padding: '2px 6px',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          /
        </div>
        {internalValue && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search query"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Live Suggestions Dropdown */}
      {isDropdownOpen && debouncedQuery.length >= 2 && (
        <div className="search-suggestions-dropdown">
          {isSuggesting ? (
            <div className="search-suggestion-loading">
              <span className="skeleton-inline" style={{ width: 16, height: 16, borderRadius: '50%' }} />
              <span>Searching suggestions for "{debouncedQuery}"...</span>
            </div>
          ) : allSuggestions.length > 0 ? (
            <div className="suggestions-list">
              {animeSuggestions.length > 0 && (
                <>
                  <div className="suggestions-header" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Tv size={14} color="var(--color-accent)" /> Anime Suggestions
                  </div>
                  {animeSuggestions.slice(0, 4).map((anime) => {
                    const globalIdx = allSuggestions.findIndex((s) => s.type === 'anime' && s.item.id === anime.id);
                    return (
                      <div
                        key={anime.id}
                        className={`suggestion-item ${globalIdx === selectedIndex ? 'selected' : ''}`}
                        onClick={() => handleSelectMedia('anime', anime.id)}
                      >
                        <img
                          src={anime.image || 'https://via.placeholder.com/80x120?text=Cover'}
                          alt={anime.title}
                          className="suggestion-thumb"
                        />
                        <div className="suggestion-info">
                          <div className="suggestion-title">{anime.title}</div>
                          <div className="suggestion-meta">
                            {anime.year && <span>{anime.year}</span>}
                            {anime.year && anime.type && <span>•</span>}
                            {anime.type && <span>{anime.type}</span>}
                            {anime.score && (
                              <span className="suggestion-score">
                                <Star size={12} fill="var(--color-score)" color="var(--color-score)" />
                                {anime.score.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowUpRight size={16} className="suggestion-arrow" />
                      </div>
                    );
                  })}
                </>
              )}

              {mangaSuggestions.length > 0 && (
                <>
                  <div className="suggestions-header" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                    <BookOpen size={14} color="var(--color-score)" /> Manga Suggestions
                  </div>
                  {mangaSuggestions.slice(0, 4).map((manga) => {
                    const globalIdx = allSuggestions.findIndex((s) => s.type === 'manga' && s.item.id === manga.id);
                    return (
                      <div
                        key={manga.id}
                        className={`suggestion-item ${globalIdx === selectedIndex ? 'selected' : ''}`}
                        onClick={() => handleSelectMedia('manga', manga.id)}
                      >
                        <img
                          src={manga.image || 'https://via.placeholder.com/80x120?text=Cover'}
                          alt={manga.title}
                          className="suggestion-thumb"
                        />
                        <div className="suggestion-info">
                          <div className="suggestion-title">{manga.title}</div>
                          <div className="suggestion-meta">
                            {manga.year && <span>{manga.year}</span>}
                            {manga.year && manga.type && <span>•</span>}
                            {manga.type && <span>{manga.type}</span>}
                            {manga.score && (
                              <span className="suggestion-score">
                                <Star size={12} fill="var(--color-score)" color="var(--color-score)" />
                                {manga.score.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowUpRight size={16} className="suggestion-arrow" />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <div className="search-suggestion-empty">No results matching "{debouncedQuery}"</div>
          )}
        </div>
      )}
    </div>
  );
};
