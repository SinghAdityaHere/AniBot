import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Anime information is temporarily unavailable.',
  onRetry,
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-secondary)' }}>
      <AlertCircle size={48} color="var(--color-error)" style={{ marginBottom: 16 }} />
      <h3 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 8 }}>
        Something went wrong
      </h3>
      <p style={{ fontSize: 14, maxWidth: 420, margin: '0 auto 20px auto' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <RefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
};
