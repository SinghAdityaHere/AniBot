import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentSearches, useRecentSearchMutations } from '../api/recentSearches';
import { History, Trash2, ArrowRight, X } from 'lucide-react';

export const RecentSearchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentSearches = [], isLoading } = useRecentSearches();
  const { deleteSearch, clearAllSearches } = useRecentSearchMutations();

  const handleOpenSearch = (q: string) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <History size={28} color="var(--color-accent)" />
            <h1 style={{ fontSize: 28 }}>Recent Searches</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
            Your recent search query history (up to 20 consolidated entries)
          </p>
        </div>

        {recentSearches.length > 0 && (
          <button
            onClick={() => clearAllSearches()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--color-error)',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      )}

      {!isLoading && recentSearches.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-secondary)' }}>
          <History size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 8 }}>
            No Recent Searches
          </h3>
          <p style={{ fontSize: 14 }}>Your search history will be saved here automatically.</p>
        </div>
      )}

      {!isLoading && recentSearches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {recentSearches.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenSearch(item.query)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <History size={18} color="var(--color-text-muted)" />
                <span style={{ fontWeight: 600, fontSize: 16 }}>{item.query}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSearch(item.id);
                  }}
                  style={{ padding: 6, borderRadius: '50%', color: 'var(--color-text-muted)' }}
                  title="Delete search"
                >
                  <X size={16} />
                </button>
                <ArrowRight size={18} color="var(--color-accent)" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
