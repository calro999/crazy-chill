'use client';

import React from 'react';

interface SuzuriButtonProps {
  productId: string;
  suzuriUrl: string;
  className: string;
  children: React.ReactNode;
}

export default function SuzuriButton({ productId, suzuriUrl, className, children }: SuzuriButtonProps) {
  return (
    <a
      href={suzuriUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      id={`product-detail-suzuri-${productId}`}
    >
      {children}
    </a>
  );
}
