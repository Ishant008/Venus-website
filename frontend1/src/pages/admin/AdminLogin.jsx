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
      <div className="flex min-h-screen items-center justify-center bg-ink-surface px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
              <ShieldCheck size={26} />
            </span>
            <h1 className="mt-4 font-title text-2xl">Admin Login</h1>
            <p className="mt-1 text-sm text-ink-muted">Sign in to manage Venus website content</p>
          </div>

          <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-8">
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
              <input
                required
                autoFocus
                placeholder="Username or email"
                className="input-field !pl-10"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
              <input
                required
                type="password"
                placeholder="Password"
                className="input-field !pl-10"
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
