import { useState } from 'react';

interface Props { src?: string; alt: string; label?: string; className?: string; priority?: boolean }

export function Photo({ src, alt, label = 'Beeld volgt', className = '', priority = false }: Props) {
  const [failedSource, setFailedSource] = useState<string>();
  return (
    <div className={`photo ${className}`}>
      {src && failedSource !== src ? (
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} onError={() => setFailedSource(src)} />
      ) : (
        <div className="photo-placeholder" role="img" aria-label={label}>
          <span className="frame-corner top-left" /><span className="frame-corner bottom-right" />
          <span className="placeholder-cross" aria-hidden="true">+</span>
          <span className="placeholder-label">{label}</span>
        </div>
      )}
    </div>
  );
}
