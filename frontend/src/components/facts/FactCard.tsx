import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Copy, Check } from 'lucide-react';
import { useRandomFact } from '../../api/facts';
import { FactCardSkeleton } from '../ui/Skeleton';

export const FactCard: React.FC = () => {
  const { data: fact, isLoading, isFetching, refetch } = useRandomFact();
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <FactCardSkeleton />;
  }

  if (!fact) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Fact (${fact.animeTitle || 'Anime Trivia'}): "${fact.fact}"`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-score)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
          <Lightbulb size={18} color="var(--color-score)" /> Did You Know? ({fact.animeTitle || 'Anime Trivia'})
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleCopy}
            title="Copy fact"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-border)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {copied ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Get another fact"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-border)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
            <span>Another Fact</span>
          </button>
        </div>
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-text-primary)', fontStyle: 'italic' }}>
        "{fact.fact}"
      </p>
    </div>
  );
};
