import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-muted">
      <Loader2 className="animate-spin text-brand" size={32} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
