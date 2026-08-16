import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  Users,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ScrollToTop from '../../components/common/ScrollToTop';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/vacancies', label: 'Job Openings', icon: Briefcase },
  { to: '/admin/applicants', label: 'Applicants', icon: Users },
  { to: '/admin/news', label: 'News & Updates', icon: Newspaper },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-6 py-6 font-title text-lg text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand">V</span>
        Venus Admin
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <l.icon size={18} /> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={18} /> View Website
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-ink-surface">
      <ScrollToTop />
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col bg-ink lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`flex h-full w-64 flex-col bg-ink transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarContent />
        </aside>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-border bg-white px-5 py-4 lg:px-8">
          <button onClick={() => setOpen(true)} className="lg:hidden">
            <Menu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-muted">Signed in as</span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{user?.username}</span>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}