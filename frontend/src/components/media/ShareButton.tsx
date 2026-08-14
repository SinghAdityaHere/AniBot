import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title = 'Share' }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--color-border)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      title="Share page link"
    >
      {copied ? <Check size={16} color="var(--color-success)" /> : <Share2 size={16} />}
      <span>{copied ? 'Link Copied!' : title}</span>
    </button>
  );
};
