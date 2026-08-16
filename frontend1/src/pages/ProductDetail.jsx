import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, MessageSquareText } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/common/SEO';
import Loader from '../components/common/Loader';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.related);
        setActiveImg(0);
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error || !product) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-ink-muted">This product could not be found.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          <ArrowLeft size={18} /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.seo?.metaTitle || product.name}
        description={product.seo?.metaDescription || product.shortDescription || product.description}
        image={product.images?.[0]?.url}
        url={`/products/${product.slug}`}
        type="product"
      />
      <section className="container-x py-14">
        <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-ink-border">
              <img src={product.images[activeImg]?.url} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img.publicId}
                    onClick={() => setActiveImg(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                      i === activeImg ? 'border-brand' : 'border-ink-border'
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="section-tag">{product.category}</span>
            <h1 className="mt-4 font-title text-3xl text-ink sm:text-4xl">{product.name}</h1>
            <p className="mt-4 text-ink-muted">{product.description}</p>

            {product.features?.length > 0 && (
              <ul className="mt-6 space-y-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={18} />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">
                <MessageSquareText size={18} /> Enquire Now
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-title text-2xl">Related Products</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link key={p._id} to={`/products/${p.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.images?.[0]?.url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-ink">{p.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
