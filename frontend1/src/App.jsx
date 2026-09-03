import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SiteLayout from './components/layout/SiteLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Analytics from './components/common/Analytics';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Career from './pages/Career';
import JobDetail from './pages/JobDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminApplicants from './pages/admin/AdminApplicants';
import AdminNews from './pages/admin/AdminNews';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

const GSC_VERIFICATION = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;

export default function App() {
  return (
    <>
      {/* Google Search Console site-ownership verification (meta-tag method) —
          only rendered when VITE_GOOGLE_SITE_VERIFICATION is set in .env */}
      {GSC_VERIFICATION && (
        <Helmet>
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        </Helmet>
      )}

      {/* Analytics is a silent, route-aware component — renders nothing */}
      <Analytics />

      <Routes>
        {/* Public website */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/career" element={<Career />} />
          <Route path="/career/:slug" element={<JobDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="vacancies" element={<AdminVacancies />} />
            <Route path="applicants" element={<AdminApplicants />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}