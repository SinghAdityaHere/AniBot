import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Compass, BookOpen, Bookmark, History, Dices, X, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  category: 'Navigation' | 'Actions';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: 'home',
      label: 'Go to Home',
      category: 'Navigation',
      icon: <Home size={18} color="var(--color-accent)" />,
      action: () => navigate('/'),
    },
    {
      id: 'discover',
      label: 'Go to Discover Portal',
      category: 'Navigation',
      icon: <Compass size={18} color="var(--color-accent)" />,
      action: () => navigate('/discover'),
    },
    {
      id: 'manga',
      label: 'Explore Manga Series',
      category: 'Navigation',
      icon: <BookOpen size={18} color="var(--color-score)" />,
      action: () => navigate('/manga'),
    },
    {
      id: 'library',
      label: 'Open My Library',
      category: 'Navigation',
      icon: <Bookmark size={18} color="var(--color-accent)" />,
      action: () => navigate('/library'),
    },
    {
      id: 'recent-searches',
      label: 'View Recent Searches History',
      category: 'Navigation',
      icon: <History size={18} color="var(--color-text-muted)" />,
      action: () => navigate('/recent-searches'),
    },
    {
      id: 'search-anime',
      label: 'Search Anime Titles',
      category: 'Actions',
      icon: <Search size={18} color="var(--color-accent)" />,
      action: () => navigate('/search?type=anime'),
    },
    {
      id: 'search-manga',
      label: 'Search Manga Series',
      category: 'Actions',
      icon: <Search size={18} color="var(--color-score)" />,
      action: () => navigate('/search?type=manga'),
    },
    {
      id: 'surprise-me',
      label: 'Surprise Me! (Random Title)',
      category: 'Actions',
      icon: <Dices size={18} color="var(--color-score)" />,
      action: () => navigate('/discover'),
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase().trim())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 580,
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-dropdown)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border-light)' }}>
          <Search size={20} color="var(--color-text-muted)" style={{ marginRight: 12 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: 16,
              color: 'var(--color-text-primary)',
            }}
          />
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Command List */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: idx === selectedIndex ? 'var(--color-accent-light)' : 'transparent',
                  color: idx === selectedIndex ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </div>

                <ArrowRight size={14} color="var(--color-text-muted)" />
              </div>
            ))
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              No command matching "{query}"
            </div>
          )}
        </div>

        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--color-border-light)', fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Navigation: Arrow Keys</span>
          <span>Execute: Enter</span>
          <span>Close: Esc</span>
        </div>
      </div>
    </div>
  );
};
