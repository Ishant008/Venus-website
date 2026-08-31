import { useEffect } from 'react';
import { X } from 'lucide-react';

const sizeClasses = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-5xl',
};

export default function Modal({ title, onClose, children, size, wide, extraWide }) {
  // Backward-compatible with the old `wide` / `extraWide` boolean props
  const resolvedSize = size || (extraWide ? 'xl' : wide ? 'lg' : 'md');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className={`flex h-full w-full flex-col bg-white sm:h-auto sm:max-h-[92vh] sm:w-full sm:rounded-2xl sm:shadow-xl ${sizeClasses[resolvedSize]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink-border px-5 py-4 sm:px-6">
          <h2 className="font-title text-lg sm:text-xl">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink-muted transition hover:bg-ink-surface hover:text-ink" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}