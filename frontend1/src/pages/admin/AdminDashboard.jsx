import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Briefcase, Users, Newspaper, ArrowRight, BarChart3, Plus, Clock, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const [products, vacancies, applicants, news] = await Promise.all([
        api.get('/products/admin/all'),
        api.get('/vacancies/admin/all'),
        api.get('/applicants'),
        api.get('/news/admin/all'),
      ]);
      setStats({
        products: products.data.count,
        vacancies: vacancies.data.count,
        applicants: applicants.data.count,
        news: news.data.count,
        newApplicants: applicants.data.applicants.filter((a) => a.status === 'new').length,
        recentApplicants: applicants.data.applicants.slice(0, 5),
      });
    })();
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, to: '/admin/products', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Job Openings', value: stats.vacancies, icon: Briefcase, to: '/admin/vacancies', gradient: 'from-amber-500 to-orange-600' },
    { label: 'Applicants', value: stats.applicants, sub: `${stats.newApplicants} new`, icon: Users, to: '/admin/applicants', gradient: 'from-purple-500 to-purple-600' },
    { label: 'News Articles', value: stats.news, icon: Newspaper, to: '/admin/news', gradient: 'from-brand to-brand-700' },
  ];

  const quickActions = [
    { label: 'Add Product', to: '/admin/products', icon: Package },
    { label: 'Post a Job', to: '/admin/vacancies', icon: Briefcase },
    { label: 'Publish Article', to: '/admin/news', icon: Newspaper },
    { label: 'View Analytics', to: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-title text-2xl">
            <Sparkles size={20} className="text-brand" /> Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Overview of your website content.</p>
        </div>
        <Link to="/admin/analytics" className="btn-outline text-sm">
          <BarChart3 size={16} /> View Analytics
        </Link>
      </div>

      {/* Gradient stat cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink-border transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 blur-xl transition group-hover:opacity-20`} />
            <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-md`}>
              <c.icon size={20} />
            </div>
            <p className="relative mt-4 text-3xl font-bold text-ink">{c.value}</p>
            <p className="relative text-sm text-ink-muted">
              {c.label} {c.sub && <span className="font-medium text-brand">&bull; {c.sub}</span>}
            </p>
            <span className="relative mt-3 flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition group-hover:opacity-100">
              Manage <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="card p-6 lg:col-span-1">
          <h3 className="flex items-center gap-2 font-semibold">
            <Plus size={16} className="text-brand" /> Quick Actions
          </h3>
          <div className="mt-4 flex flex-col gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-surface">
                  <a.icon size={15} />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent applicants */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold">
              <Clock size={16} className="text-brand" /> Recent Applicants
            </h3>
            <Link to="/admin/applicants" className="text-xs font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-ink-border">
            {stats.recentApplicants.length === 0 && <p className="py-6 text-center text-sm text-ink-muted">No applicants yet.</p>}
            {stats.recentApplicants.map((a) => (
              <div key={a._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{a.name}</p>
                  <p className="text-xs text-ink-muted">{a.vacancy?.title || 'General application'}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                    a.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-ink-surface text-ink-muted'
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}