import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Briefcase, Users, Newspaper, ArrowRight } from 'lucide-react';
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
      });
    })();
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, to: '/admin/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Job Openings', value: stats.vacancies, icon: Briefcase, to: '/admin/vacancies', color: 'bg-amber-50 text-amber-600' },
    { label: 'Applicants', value: stats.applicants, sub: `${stats.newApplicants} new`, icon: Users, to: '/admin/applicants', color: 'bg-purple-50 text-purple-600' },
    { label: 'News Articles', value: stats.news, icon: Newspaper, to: '/admin/news', color: 'bg-brand-50 text-brand-700' },
  ];

  return (
    <div>
      <h1 className="font-title text-2xl">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Overview of your website content.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card flex flex-col gap-4 p-6">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{c.value}</p>
              <p className="text-sm text-ink-muted">
                {c.label} {c.sub && <span className="text-brand">&bull; {c.sub}</span>}
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-brand">
              Manage <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
