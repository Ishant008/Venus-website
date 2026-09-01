import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ShieldCheck, Download } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/news', label: 'News & Updates' },
  { to: '/career', label: 'Career' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { canInstall, promptInstall } = usePwaInstall();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-white'
      }`}
    >
      <div className="container-x flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 font-title text-xl text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
            <ShieldCheck size={18} />
          </span>
          Venus <span className="hidden text-ink-muted sm:inline">Global</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-brand ${
                  isActive ? 'text-brand' : 'text-ink-soft'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {canInstall && (
            <button onClick={promptInstall} className="btn-outline !px-4 !py-2.5 text-sm" title="Install Venus Global as an app">
              <Download size={16} /> Install App
            </button>
          )}
          <Link to="/admin/login" className="btn-outline !px-5 !py-2.5 text-sm">
            Admin
          </Link>
          <Link to="/contact" className="btn-primary !px-5 !py-2.5 text-sm">
            Get in Touch
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-ink-border p-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`ml-auto flex h-full w-[80%] max-w-sm flex-col bg-white p-6 shadow-xl transition-transform ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="font-title text-lg">Venus Global</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-5">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? 'text-brand' : 'text-ink-soft'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {canInstall && (
              <button
                onClick={() => {
                  promptInstall();
                  setOpen(false);
                }}
                className="btn-outline justify-center"
              >
                <Download size={16} /> Install App
              </button>
            )}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="btn-outline justify-center">
              Admin Login
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary justify-center">
              Get in Touch
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}