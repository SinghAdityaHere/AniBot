import React from 'react';
import { useRandomQuote } from '../../api/quotes';
import { QuoteCard } from './QuoteCard';
import { QuoteCardSkeleton } from '../ui/Skeleton';

export const RandomQuote: React.FC = () => {
  const { data: quote, isLoading, isError, isFetching, refetch } = useRandomQuote();

  if (isLoading) {
    return <QuoteCardSkeleton />;
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

  return <QuoteCard quote={quote} onRefresh={() => refetch()} isRefreshing={isFetching} />;
};
