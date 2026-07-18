'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LightboxGallery.module.css';

interface GalleryImage {
  src: string;
  alt: string;
  seriesName?: string;
  linkHref?: string;
  linkLabel?: string;
}

interface LightboxGalleryProps {
  images: GalleryImage[];
}

export default function LightboxGallery({ images }: LightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      }
    };
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  const closeLightbox = () => setSelectedIndex(null);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, i) => (
          <div
            key={i}
            className={styles.gridItem}
            onClick={() => setSelectedIndex(i)}
            role="button"
            tabIndex={0}
            aria-label={`${image.alt} を拡大表示する`}
            onKeyDown={(e) => { if (e.key === 'Enter') setSelectedIndex(i); }}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={styles.thumbnail}
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            {image.seriesName && (
              <div className={styles.seriesLabel}>
                {image.seriesName}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedIndex !== null && selectedImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox} aria-label="閉じる">
            ×
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.fullImageWrapper}>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                className={styles.fullImage}
                style={{ objectFit: 'contain' }}
              />
            </div>
            {selectedImage.linkHref && (
              <div className={styles.actionArea}>
                <Link href={selectedImage.linkHref} className={styles.linkButton} onClick={closeLightbox}>
                  {selectedImage.linkLabel || 'このアイテムを見る →'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
