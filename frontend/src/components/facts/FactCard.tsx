import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useRandomFact } from '../../api/facts';

export const FactCard: React.FC = () => {
  const { data: fact, isLoading } = useRandomFact();

  if (isLoading) {
    return <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />;
  }

  if (!fact) return null;

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
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-score)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
        <Lightbulb size={18} color="var(--color-score)" /> Did You Know? ({fact.animeTitle || 'Anime Trivia'})
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-text-primary)', fontStyle: 'italic' }}>
        "{fact.fact}"
      </p>
    </div>
  );
};
