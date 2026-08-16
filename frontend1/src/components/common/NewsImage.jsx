import { Newspaper } from 'lucide-react';

export default function NewsImage({ src, alt, className = '' }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-ink to-ink-soft text-white/30 ${className}`}>
        <Newspaper size={40} strokeWidth={1.2} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}