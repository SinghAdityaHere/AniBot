import React, { useState } from 'react';
import { Quote as QuoteIcon, Copy, Check, RefreshCw } from 'lucide-react';
import { AnimeQuote } from '@anibot/shared';

interface QuoteCardProps {
  quote: AnimeQuote;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onRefresh, isRefreshing }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `"${quote.quote}" — ${quote.character || 'Unknown'} (${quote.animeTitle || 'Anime'})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy quote:', e);
    }
  };

  return (
    <div className="quote-card">
      <QuoteIcon className="quote-icon" />
      <p className="quote-text">“{quote.quote}”</p>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div className="quote-author">— {quote.character || 'Unknown Character'}</div>
          {quote.animeTitle && <div className="quote-anime">{quote.animeTitle}</div>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, zIndex: 5 }}>
          <button
            onClick={handleCopy}
            title="Copy quote"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--color-border)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
            }}
          >
            {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Get another quote"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>New Quote</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
