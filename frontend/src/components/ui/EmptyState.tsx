import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Anime Found',
  description = 'Try searching with a different keyword or checking spelling.',
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-secondary)' }}>
      <SearchX size={48} color="#9C9C9C" style={{ marginBottom: 16 }} />
      <h3 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>{description}</p>
    </div>
  );
};
