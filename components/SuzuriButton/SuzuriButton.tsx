'use client';

import React from 'react';

interface SuzuriButtonProps {
  productId: string;
  suzuriUrl: string;
  className: string;
  children: React.ReactNode;
}

export default function SuzuriButton({ productId, suzuriUrl, className, children }: SuzuriButtonProps) {
  const handleClick = () => {
    fetch('/api/insights/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    }).catch(err => console.error('Click tracking failed', err));
  };

  return (
    <a
      href={suzuriUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      id={`product-detail-suzuri-${productId}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
