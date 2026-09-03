import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  Users,
  Newspaper,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ScrollToTop from '../../components/common/ScrollToTop';

const navGroups = [
  {
    label: 'Content',
    links: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/vacancies', label: 'Job Openings', icon: Briefcase },
      { to: '/admin/applicants', label: 'Applicants', icon: Users },
      { to: '/admin/news', label: 'News & Updates', icon: Newspaper },
    ],
  },
  {
    label: 'Insights',
    links: [{ to: '/admin/analytics', label: 'Analytics', icon: BarChart3 }],
  },
  {
    label: 'Account',
    links: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

const allLinks = navGroups.flatMap((g) => g.links);

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const currentLink = allLinks.find((l) => location.pathname.startsWith(l.to));
  const initials = (user?.username || 'A').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-700 shadow-lg shadow-brand/20">
          <ShieldCheck size={19} className="text-white" />
        </span>
        <div>
          <p className="font-title text-base leading-tight text-white">Venus Admin</p>
          <p className="text-[11px] leading-tight text-white/40">Control Panel</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-white/30">{group.label}</p>
            <div className="flex flex-col gap-1">
              {group.links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute left-0 h-5 w-1 rounded-r-full bg-brand" />}
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          isActive ? 'bg-brand text-white' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'
                        }`}
                      >
                        <l.icon size={16} />
                      </span>
                      {l.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={16} /> View Website
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen-safe bg-ink-surface">
      <ScrollToTop />

      {/* Desktop sidebar — dark gradient with subtle glow */}
      <aside
        className="relative hidden w-64 flex-col overflow-hidden bg-gradient-to-b from-[#15161a] via-ink to-[#0d0e10] lg:flex"
        style={{ backgroundColor: '#0d0e10' }}
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand/20 blur-[80px]" />
        <div className="relative flex flex-1 flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`isolate flex h-full w-72 flex-col bg-ink text-white transition-transform ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ backgroundColor: '#0d0e10' }}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarContent />
        </aside>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-border bg-white/80 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 hover:bg-ink-surface lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-ink-muted">Venus Admin</p>
              <h2 className="flex items-center gap-2 font-semibold text-ink">
                {currentLink?.icon && <currentLink.icon size={16} className="text-brand" />}
                {currentLink?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-ink-muted">Signed in as</p>
              <p className="text-sm font-medium text-ink">{user?.username}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-700 text-xs font-bold text-white shadow-md">
              {initials}
            </span>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}