import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Eye, Link as LinkIcon, Clock } from 'lucide-react';
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import api from '../lib/api';
import SEO from '../components/common/SEO';
import NewsImage from '../components/common/NewsImage';
import Loader from '../components/common/Loader';

const SITE_URL = import.meta.env.VITE_SITE_URL || '';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Rough reading time based on word count of the HTML body
const readingTime = (html = '') => {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export default function NewsDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/news/${slug}`)
      .then(({ data }) => {
        setItem(data.item);
        setRelated(data.related);
      })
      .catch(() => setError('Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const shareUrl = `${SITE_URL}/news/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  if (loading) return <Loader />;
  if (error || !item) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-ink-muted">This article could not be found.</p>
        <Link to="/news" className="btn-primary mt-6 inline-flex">
          <ArrowLeft size={18} /> Back to News
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary,
    image: item.coverImage?.url ? [item.coverImage.url] : undefined,
    datePublished: item.publishDate,
    dateModified: item.updatedAt,
    author: { '@type': 'Organization', name: 'Venus Global Enterprises' },
    publisher: { '@type': 'Organization', name: 'Venus Global Enterprises' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': shareUrl },
  };

  return (
    <>
      <SEO
        title={item.seo?.metaTitle || item.title}
        description={item.seo?.metaDescription || item.summary}
        image={item.seo?.ogImage || item.coverImage?.url}
        url={`/news/${item.slug}`}
        type="article"
        publishedTime={item.publishDate}
        keywords={item.seo?.metaKeywords}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Full-bleed hero image, news-channel style */}
      <section className="relative">
        <NewsImage src={item.coverImage?.url} alt={item.title} className="h-[45vh] max-h-[500px] w-full sm:h-[55vh]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-10 text-white">
          <Link to="/news" className="mb-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-brand">
            <ArrowLeft size={16} /> Back to News
          </Link>
          <span className="rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wide">{item.category}</span>
          <h1 className="mt-4 max-w-3xl font-title text-3xl leading-snug sm:text-4xl lg:text-5xl">{item.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(item.publishDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {readingTime(item.body)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} /> {item.views} views
            </span>
          </div>
        </div>
      </section>

      <article className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-lg font-medium text-ink-soft">{item.summary}</p>

          <div
            className="prose prose-ink mt-6 max-w-none prose-headings:font-title prose-a:text-brand"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />

          {item.images?.length > 0 && (
            <div className={`mt-8 grid gap-3 ${item.images.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
              {item.images.map((img) => (
                <figure key={img.publicId} className="overflow-hidden rounded-xl">
                  <img src={img.url} alt={img.alt || item.title} loading="lazy" className="aspect-video w-full object-cover" />
                  {img.alt && <figcaption className="mt-1.5 text-xs text-ink-muted">{img.alt}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {item.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Social sharing (SMO) */}
          <div className="mt-10 flex items-center gap-3 border-t border-ink-border pt-6">
            <span className="text-sm font-medium text-ink-muted">Share this article:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-surface text-ink-soft transition hover:bg-brand hover:text-white"
              aria-label="Share on Facebook"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-surface text-ink-soft transition hover:bg-brand hover:text-white"
              aria-label="Share on Twitter/X"
            >
              <FaXTwitter size={14} />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${item.title} - ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-surface text-ink-soft transition hover:bg-brand hover:text-white"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp size={15} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-surface text-ink-soft transition hover:bg-brand hover:text-white"
              aria-label="Share on LinkedIn"
            >
              <FaLinkedinIn size={14} />
            </a>
            <button
              onClick={copyLink}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-surface text-ink-soft transition hover:bg-brand hover:text-white"
              aria-label="Copy link"
            >
              <LinkIcon size={16} />
            </button>
          </div>
        </div>

        {/* Sidebar - more from category */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-ink-border p-5">
            <h3 className="font-title text-lg">More from {item.category}</h3>
            <div className="mt-4 flex flex-col divide-y divide-ink-border">
              {related.map((r) => (
                <Link key={r._id} to={`/news/${r.slug}`} className="group flex gap-3 py-4 first:pt-0">
                  <NewsImage src={r.coverImage?.url} alt={r.title} className="aspect-square w-16 shrink-0 rounded-lg" />
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 text-sm font-medium text-ink transition group-hover:text-brand">{r.title}</h4>
                    <span className="text-xs text-ink-muted">{formatDate(r.publishDate)}</span>
                  </div>
                </Link>
              ))}
              {related.length === 0 && <p className="py-4 text-sm text-ink-muted">No related articles yet.</p>}
            </div>
          </div>
        </aside>
      </article>
    </>
  );
}