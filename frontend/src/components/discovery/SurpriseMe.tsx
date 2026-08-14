import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Dices, Tv, BookOpen, Loader2 } from 'lucide-react';
import { fetchDirectRandomAnime, fetchDirectRandomManga } from '../../api/directApi';

export const SurpriseMe: React.FC = () => {
  const navigate = useNavigate();
  const [loadingType, setLoadingType] = useState<'anime' | 'manga' | 'any' | null>(null);

  const handleSurprise = async (type: 'anime' | 'manga' | 'any') => {
    if (loadingType) return;
    setLoadingType(type);
    try {
      if (type === 'anime') {
        const anime = await fetchDirectRandomAnime();
        if (anime && anime.id) {
          navigate(`/anime/${anime.id}`);
        } else {
          navigate('/search?type=anime');
        }
      } else if (type === 'manga') {
        const manga = await fetchDirectRandomManga();
        if (manga && manga.id) {
          navigate(`/manga/${manga.id}`);
        } else {
          navigate('/manga');
        }
      } else {
        const isAnime = Math.random() > 0.5;
        if (isAnime) {
          const anime = await fetchDirectRandomAnime();
          if (anime && anime.id) {
            navigate(`/anime/${anime.id}`);
          } else {
            navigate('/search?type=anime');
          }
        } else {
          const manga = await fetchDirectRandomManga();
          if (manga && manga.id) {
            navigate(`/manga/${manga.id}`);
          } else {
            navigate('/manga');
          }
        }
      }
    } catch (err) {
      console.warn('Surprise Me failed:', err);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div
      style={{
        padding: '24px 32px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-floating)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Dices size={24} color="var(--color-accent)" />
          <h3 style={{ fontSize: 20 }}>Surprise Me!</h3>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Can't decide what to watch or read next? Let AniBot pick a random gem for you.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <button
          onClick={() => handleSurprise('anime')}
          disabled={!!loadingType}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-border)',
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--color-text-primary)',
            cursor: loadingType ? 'wait' : 'pointer',
            opacity: loadingType && loadingType !== 'anime' ? 0.6 : 1,
          }}
        >
          {loadingType === 'anime' ? (
            <Loader2 size={16} className="animate-spin" color="var(--color-accent)" />
          ) : (
            <Tv size={16} color="var(--color-accent)" />
          )}
          <span>{loadingType === 'anime' ? 'Finding Anime...' : 'Random Anime'}</span>
        </button>

        <button
          onClick={() => handleSurprise('manga')}
          disabled={!!loadingType}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--color-border)',
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--color-text-primary)',
            cursor: loadingType ? 'wait' : 'pointer',
            opacity: loadingType && loadingType !== 'manga' ? 0.6 : 1,
          }}
        >
          {loadingType === 'manga' ? (
            <Loader2 size={16} className="animate-spin" color="var(--color-score)" />
          ) : (
            <BookOpen size={16} color="var(--color-score)" />
          )}
          <span>{loadingType === 'manga' ? 'Finding Manga...' : 'Random Manga'}</span>
        </button>

        <button
          onClick={() => handleSurprise('any')}
          disabled={!!loadingType}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 22px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 14,
            cursor: loadingType ? 'wait' : 'pointer',
            opacity: loadingType && loadingType !== 'any' ? 0.6 : 1,
          }}
        >
          {loadingType === 'any' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          <span>{loadingType === 'any' ? 'Picking...' : 'Anything!'}</span>
        </button>
      </div>
    </div>
  );
};
