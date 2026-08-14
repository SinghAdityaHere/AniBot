import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

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
  placeholder = 'Search anime... e.g. Attack on Titan, Naruto',
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch && internalValue.trim()) {
      onSearch(internalValue.trim());
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="search-bar-wrapper">
      <SearchIcon size={20} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
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
  );
};
