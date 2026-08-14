import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Star, ArrowUpRight } from 'lucide-react';
import { useAnimeSearch } from '../../api/anime';
import { Anime } from '@anibot/shared';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search anime... e.g. Naruto, Attack on Titan, Solo Leveling',
  autoFocus = false,
}) => {
  const navigate = useNavigate();
  const [internalValue, setInternalValue] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const { data: suggestions = [], isLoading: isSuggesting } = useAnimeSearch(
    debouncedQuery.length >= 2 ? debouncedQuery : ''
  );

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(val);
    setIsDropdownOpen(val.trim().length >= 2);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && internalValue.trim()) {
      setIsDropdownOpen(false);
      if (onSearch) {
        onSearch(internalValue.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(internalValue.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    setDebouncedQuery('');
    setIsDropdownOpen(false);
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  };

  const handleSelectAnime = (anime: Anime) => {
    setIsDropdownOpen(false);
    navigate(`/anime/${anime.id}`);
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div style={{ position: 'relative' }}>
        <SearchIcon size={20} className="search-icon" />
        <input
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
          aria-label="Search anime"
        />
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
          ) : suggestions.length > 0 ? (
            <div className="suggestions-list">
              <div className="suggestions-header">Anime Suggestions</div>
              {suggestions.slice(0, 6).map((anime) => (
                <div
                  key={anime.id}
                  className="suggestion-item"
                  onClick={() => handleSelectAnime(anime)}
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
              ))}
            </div>
          ) : (
            <div className="search-suggestion-empty">No anime matching "{debouncedQuery}"</div>
          )}
        </div>
      )}
    </div>
  );
};
