import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/common/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" noindex url="/404" />
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="font-title text-7xl text-brand">404</span>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-ink-muted">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary mt-8">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </>
  );
}
