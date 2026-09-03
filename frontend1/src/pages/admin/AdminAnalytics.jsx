import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BarChart3, ExternalLink, RefreshCw, Video, AlertTriangle } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

// Clarity's API can return numbers as strings and metric names in various
// casings depending on the metric — normalize a bit for nicer display.
const formatLabel = (str = '') =>
  str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

const formatValue = (v) => {
  if (v === null || v === undefined) return '—';
  const num = Number(v);
  if (!Number.isNaN(num) && String(v).trim() !== '') {
    return num >= 1000 ? num.toLocaleString('en-IN') : num % 1 === 0 ? num : num.toFixed(2);
  }
  return String(v);
};

export default function AdminAnalytics() {
  const [numOfDays, setNumOfDays] = useState(3);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get('/analytics/clarity', { params: { numOfDays } })
      .then(({ data }) => setMetrics(Array.isArray(data.data) ? data.data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [numOfDays]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-title text-2xl">
            <BarChart3 className="text-brand" size={24} /> Analytics
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Traffic &amp; engagement, powered by Microsoft Clarity.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={numOfDays}
            onChange={(e) => setNumOfDays(Number(e.target.value))}
            className="input-field !w-auto !py-2 text-sm"
          >
            <option value={1}>Last 1 day</option>
            <option value={2}>Last 2 days</option>
            <option value={3}>Last 3 days</option>
          </select>
          <button onClick={load} className="btn-outline !px-4 !py-2 text-sm" title="Refresh">
            <RefreshCw size={15} />
          </button>
          {CLARITY_PROJECT_ID && (
            <a
              href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/dashboard`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-4 !py-2 text-sm"
            >
              <Video size={15} /> View Recordings
            </a>
          )}
        </div>
      </div>

      {/* Recordings/heatmaps live-note */}
      <div className="mt-6 flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
        <Video size={18} className="mt-0.5 shrink-0" />
        <p>
          Session recordings and heatmaps can&apos;t be embedded here (Clarity keeps those in their own
          dashboard for privacy reasons) — the numbers below are aggregated stats only. Click{' '}
          <strong>View Recordings</strong> above to watch real visitor sessions on clarity.microsoft.com.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <EmptyState icon={AlertTriangle} title="Couldn't load analytics" description={error} />
        ) : !metrics || metrics.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            description="Once your site has visitors, metrics will appear here (Clarity needs some traffic first)."
          />
        ) : (
          <>
            <div className="flex justify-end">
              <button onClick={() => setShowRaw((s) => !s)} className="text-xs font-medium text-ink-muted underline">
                {showRaw ? 'Show cards' : 'Show raw data'}
              </button>
            </div>

            {showRaw ? (
              <pre className="mt-3 max-h-[600px] overflow-auto rounded-xl bg-ink p-4 text-xs text-brand-200">
                {JSON.stringify(metrics, null, 2)}
              </pre>
            ) : (
              <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric, i) => (
                  <div key={metric.metricName || i} className="card p-5">
                    <h3 className="font-semibold text-ink">{formatLabel(metric.metricName || `Metric ${i + 1}`)}</h3>
                    <div className="mt-4 flex flex-col gap-2">
                      {(metric.information || []).slice(0, 6).map((info, j) => (
                        <div key={j} className="flex items-center justify-between border-b border-ink-border pb-2 text-sm last:border-0">
                          <span className="text-ink-muted">
                            {formatLabel(info.dimension1 || info.name || info.browser || info.os || info.device || info.channel || `Row ${j + 1}`)}
                          </span>
                          <span className="font-medium text-ink">
                            {formatValue(info.totalSessionCount ?? info.subTotal ?? info.value ?? info.sessionsCount)}
                          </span>
                        </div>
                      ))}
                      {(!metric.information || metric.information.length === 0) && (
                        <p className="text-xs text-ink-muted">No breakdown available for this metric.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}