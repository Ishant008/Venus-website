import { CheckCircle2, AlertCircle, XCircle, Sparkles } from 'lucide-react';

const statusIcon = {
  good: <CheckCircle2 className="shrink-0 text-brand" size={16} />,
  ok: <AlertCircle className="shrink-0 text-amber-500" size={16} />,
  bad: <XCircle className="shrink-0 text-red-500" size={16} />,
};

const scoreColor = (score) => (score >= 80 ? 'text-brand' : score >= 50 ? 'text-amber-500' : 'text-red-500');
const scoreLabel = (score) => (score >= 80 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Poor');

export default function SeoPanel({ analysis, suggestedKeywords, onUseKeyword }) {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-surface p-4">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles size={16} className="text-brand" /> SEO &amp; Readability Score
        </h4>
        <span className={`text-lg font-bold ${scoreColor(analysis.score)}`}>
          {analysis.score}/100 <span className="text-xs font-normal">&middot; {scoreLabel(analysis.score)}</span>
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-border">
        <div
          className={`h-full rounded-full transition-all ${analysis.score >= 80 ? 'bg-brand' : analysis.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {analysis.checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-xs">
            {statusIcon[c.status]}
            <span>
              <span className="font-medium text-ink">{c.label}:</span> <span className="text-ink-muted">{c.message}</span>
            </span>
          </li>
        ))}
      </ul>

      {suggestedKeywords?.length > 0 && (
        <div className="mt-4 border-t border-ink-border pt-4">
          <p className="text-xs font-medium text-ink-muted">Suggested keywords (from your content):</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestedKeywords.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onUseKeyword(k)}
                className="rounded-full bg-white px-3 py-1 text-xs text-ink-soft ring-1 ring-ink-border transition hover:bg-brand hover:text-white hover:ring-brand"
              >
                + {k}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}