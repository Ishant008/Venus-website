import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Search, TrendingUp, Radio, Eye } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/common/SEO';
import NewsImage from '../components/common/NewsImage';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function News() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState(params.get('search') || '');
  const [trending, setTrending] = useState([]);

  const category = params.get('category') || 'all';
  const isDefaultView = category === 'all' && !params.get('search') && page === 1;

  useEffect(() => {
    setLoading(true);
    api
      .get('/news', { params: { category, search: params.get('search') || undefined, page, limit: 10 } })
      .then(({ data }) => {
        setItems(data.items);
        setCategories(data.categories);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, params, page]);

  // Trending strip — most-viewed articles, fetched once
  useEffect(() => {
    api
      .get('/news', { params: { limit: 20 } })
      .then(({ data }) => {
        const sorted = [...data.items].sort((a, b) => b.views - a.views).slice(0, 5);
        setTrending(sorted);
      })
      .catch(() => {});
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (search) next.set('search', search);
    else next.delete('search');
    setParams(next);
    setPage(1);
  };

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c === 'all') next.delete('category');
    else next.set('category', c);
    setParams(next);
    setPage(1);
  };

  const featured = isDefaultView ? items[0] : null;
  const rest = isDefaultView ? items.slice(1) : items;

  return (
    <>
      <SEO
        title="News & Updates"
        description="The latest news, product updates, and announcements from Venus Global Enterprises."
        url="/news"
      />

      {/* Masthead */}
      <section className="border-b border-ink-border bg-ink text-white">
        <div className="container-x flex items-center justify-between py-6">
          <div>
            <span className="section-tag bg-white/10 text-brand-200">Newsroom</span>
            <h1 className="mt-3 font-title text-3xl sm:text-4xl">Venus News &amp; Updates</h1>
          </div>
          <Radio className="hidden text-brand sm:block" size={32} />
        </div>
        {/* Breaking ticker */}
        {trending.length > 0 && (
          <div className="border-t border-white/10 bg-black/30">
            <div className="container-x flex items-center gap-3 overflow-hidden py-2.5 text-sm">
              <span className="flex shrink-0 items-center gap-1.5 rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wide">
                <TrendingUp size={13} /> Trending
              </span>
              <div className="relative flex-1 overflow-hidden">
                <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
                  {[...trending, ...trending].map((t, i) => (
                    <Link key={i} to={`/news/${t.slug}`} className="text-white/80 transition hover:text-brand">
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="container-x py-10">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === 'all' ? 'bg-ink text-white' : 'bg-ink-surface text-ink-soft hover:bg-brand-50'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === c ? 'bg-ink text-white' : 'bg-ink-surface text-ink-soft hover:bg-brand-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <form onSubmit={onSearch} className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search news..."
              className="input-field !pl-10"
            />
          </form>
        </div>

        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState icon={Radio} title="No articles found" description="Try a different category or search term." />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Main column */}
            <div className="lg:col-span-2">
              {/* Lead story */}
              {featured && (
                <Link to={`/news/${featured.slug}`} className="group relative mb-8 block overflow-hidden rounded-2xl">
                  <NewsImage src={featured.coverImage?.url} alt={featured.title} className="aspect-[16/9] w-full transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wide">{featured.category}</span>
                    <h2 className="mt-3 font-title text-2xl leading-snug sm:text-3xl">{featured.title}</h2>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/80">{featured.summary}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/70">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(featured.publishDate)}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {featured.views} views</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Story list */}
              <div className="flex flex-col divide-y divide-ink-border">
                {rest.map((item) => (
                  <Link key={item._id} to={`/news/${item.slug}`} className="group flex gap-5 py-6 first:pt-0">
                    <NewsImage
                      src={item.coverImage?.url}
                      alt={item.title}
                      className="aspect-[4/3] w-32 shrink-0 rounded-xl sm:w-44"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold uppercase tracking-wide text-brand">{item.category}</span>
                        <span className="text-ink-muted">&bull; {formatDate(item.publishDate)}</span>
                      </div>
                      <h3 className="mt-1.5 line-clamp-2 font-title text-lg text-ink transition group-hover:text-brand sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition ${
                        p === page ? 'bg-brand text-white' : 'bg-ink-surface text-ink-soft hover:bg-brand-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-8">
              <div className="rounded-2xl border border-ink-border p-5">
                <h3 className="flex items-center gap-2 font-title text-lg">
                  <TrendingUp size={18} className="text-brand" /> Trending Now
                </h3>
                <div className="mt-4 flex flex-col divide-y divide-ink-border">
                  {trending.map((t, i) => (
                    <Link key={t._id} to={`/news/${t.slug}`} className="group flex gap-3 py-3 first:pt-0">
                      <span className="font-title text-2xl text-ink-faint">{i + 1}</span>
                      <div className="min-w-0">
                        <h4 className="line-clamp-2 text-sm font-medium text-ink transition group-hover:text-brand">{t.title}</h4>
                        <span className="text-xs text-ink-muted">{formatDate(t.publishDate)}</span>
                      </div>
                    </Link>
                  ))}
                  {trending.length === 0 && <p className="py-3 text-sm text-ink-muted">No data yet.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-ink-border p-5">
                <h3 className="font-title text-lg">Categories</h3>
                <div className="mt-4 flex flex-col gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                        category === c ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-ink-surface'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}