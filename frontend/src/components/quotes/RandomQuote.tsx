import React from 'react';
import { useRandomQuote } from '../../api/quotes';
import { QuoteCard } from './QuoteCard';

export const RandomQuote: React.FC = () => {
  const { data: quote, isLoading, isError } = useRandomQuote();

  if (isLoading) {
    return <div className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-lg)' }} />;
  }

  if (isError || !quote) {
    return (
      <div
        style={{
          padding: 20,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--color-text-secondary)',
          fontSize: 14,
        }}
      >
        Quote temporarily unavailable.
      </div>
    );
  }

  return <QuoteCard quote={quote} />;
};
