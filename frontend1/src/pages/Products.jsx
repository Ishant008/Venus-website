import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, PackageSearch } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/common/SEO';
import SectionHeading from '../components/common/SectionHeading';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const category = params.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: { category, search: params.get('search') || undefined, limit: 24 } })
      .then(({ data }) => {
        setProducts(data.products);
        setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  }, [category, params]);

  const onSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (search) next.set('search', search);
    else next.delete('search');
    setParams(next);
  };

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c === 'all') next.delete('category');
    else next.set('category', c);
    setParams(next);
  };

  return (
    <>
      <SEO
        title="Products"
        description="Explore Venus Global's product lineup — purpose-built software systems for law enforcement and field operations."
        url="/products"
      />
      <section className="container-x py-16">
        <SectionHeading tag="Our Products" title="Systems built for the field" align="left" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
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
              placeholder="Search products..."
              className="input-field !pl-10"
            />
          </form>
        </div>

        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <EmptyState icon={PackageSearch} title="No products found" description="Try a different category or search term." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wide text-brand">{p.category}</span>
                    <h3 className="mt-1 font-semibold text-ink">{p.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{p.shortDescription || p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
