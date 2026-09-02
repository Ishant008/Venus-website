import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ShieldCheck, Download, Languages } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { canInstall, promptInstall } = usePwaInstall();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/products', label: t('nav.products') },
    { to: '/services', label: t('nav.services') },
    { to: '/news', label: t('nav.news') },
    { to: '/career', label: t('nav.career') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'hi' ? 'en' : 'hi');
  };

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

        <nav className="hidden items-center gap-6 lg:flex">
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

        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-ink-border px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:border-brand hover:text-brand"
            title={t('common.language')}
          >
            <Languages size={15} /> {i18n.language === 'hi' ? 'EN' : 'हिं'}
          </button>
          {canInstall && (
            <button onClick={promptInstall} className="btn-outline !px-4 !py-2.5 text-sm" title="Install Venus Global as an app">
              <Download size={16} /> {t('nav.installApp')}
            </button>
          )}
          <Link to="/admin/login" className="btn-outline !px-5 !py-2.5 text-sm">
            {t('nav.admin')}
          </Link>
          <Link to="/contact" className="btn-primary !px-5 !py-2.5 text-sm">
            {t('nav.getInTouch')}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-full border border-ink-border px-3 py-2 text-xs font-medium text-ink-soft"
          >
            <Languages size={13} /> {i18n.language === 'hi' ? 'EN' : 'हिं'}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full border border-ink-border p-2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
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
                <Download size={16} /> {t('nav.installApp')}
              </button>
            )}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="btn-outline justify-center">
              {t('nav.adminLogin')}
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary justify-center">
              {t('nav.getInTouch')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}