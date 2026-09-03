import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';

export default function AdminLogin() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={location.state?.from?.pathname || '/admin/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" noindex url="/admin/login" />
      <div className="relative flex min-h-screen-safe items-center justify-center overflow-hidden bg-gradient-to-b from-[#15161a] via-ink to-[#0d0e10] px-4">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/10 blur-[100px]" />

        <div className="relative w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-700 text-white shadow-lg shadow-brand/30">
              <ShieldCheck size={26} />
            </span>
            <h1 className="mt-4 font-title text-2xl text-white">Admin Login</h1>
            <p className="mt-1 text-sm text-white/50">Sign in to manage Venus website content</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white/[0.07] p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                required
                autoFocus
                placeholder="Username or email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-10 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary justify-center">
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}