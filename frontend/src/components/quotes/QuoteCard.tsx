import React from 'react';
import { Quote } from 'lucide-react';
import { AnimeQuote } from '@anibot/shared';

interface QuoteCardProps {
  quote: AnimeQuote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <div className="quote-card">
      <Quote className="quote-icon" />
      <p className="quote-text">“{quote.quote}”</p>
      <div className="quote-author">— {quote.character || 'Unknown Character'}</div>
      {quote.animeTitle && <div className="quote-anime">{quote.animeTitle}</div>}
    </div>
  );
};
