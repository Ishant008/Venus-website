import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine,
  Monitor,
  FolderOpen,
  ShoppingBag,
  NotebookPen,
  Globe,
  Code2,
  Headset,
  Wrench,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/common/SEO';

// Same rotating phrases as the original site's typing effect
const TYPING_TEXTS = ['Scanning & Digitization', 'Selling Quality Products', 'Innovative IT Solutions'];

function useTypingEffect(texts, { typeSpeed = 100, deleteSpeed = 50, pause = 1500, gap = 300 } = {}) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const current = texts[textIndex];

      if (!deleting) {
        charIndex++;
        setDisplay(current.slice(0, charIndex));
        if (charIndex === current.length) {
          timeoutId = setTimeout(() => {
            deleting = true;
            tick();
          }, pause);
          return;
        }
        timeoutId = setTimeout(tick, typeSpeed);
      } else {
        charIndex--;
        setDisplay(current.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          textIndex = (textIndex + 1) % texts.length;
          timeoutId = setTimeout(tick, gap);
          return;
        }
        timeoutId = setTimeout(tick, deleteSpeed);
      }
    };

    timeoutId = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timeoutId);
  }, [texts, typeSpeed, deleteSpeed, pause, gap]);

  return display;
}

const trustChecklist = [
  'Growing Software Development Team',
  'Trusted by Government & Corporate Clients',
  'Expertise in Scanning & Digitalization',
  'Wide Range of Products Across Categories',
];

const services = [
  { icon: ScanLine, title: 'Scanning & Digitization', desc: 'Converting physical files into secure, digital formats.' },
  { icon: FolderOpen, title: 'Data Management', desc: 'Organizing, storing & retrieving records with ease.' },
  { icon: ShoppingBag, title: 'Product Supply', desc: 'Quality furniture, electronics, clothing & more.' },
  { icon: NotebookPen, title: 'Stationery & Office Needs', desc: 'Supplying everyday essentials for smooth operations.' },
  { icon: Globe, title: 'Web Development', desc: 'Building fast, modern & user-friendly websites.' },
  { icon: Code2, title: 'Software Development', desc: 'Custom solutions to optimize business workflows.' },
  { icon: Headset, title: 'IT Consulting', desc: 'Helping businesses adopt the right digital strategies.' },
  { icon: Wrench, title: 'Support & Maintenance', desc: 'Reliable after-sales and technical assistance.' },
];

const clientLogos = [1, 2, 3, 4, 5, 6, 7];

export default function Home() {
  const typedText = useTypingEffect(TYPING_TEXTS);

  return (
    <>
      <SEO
        title="Scanning, Digitalization & IT Solutions"
        description="Venus Global specializes in scanning & digitization, offers a wide range of products from furniture to clothing, and is expanding with a dynamic IT department to shape the future of technology."
        url="/"
      />

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ink-surface to-white">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-100 opacity-50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-brand-50 opacity-70 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#202124 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />

        <div className="container-x relative grid gap-14 py-16 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-24">
          {/* Text column */}
          <div className="flex animate-fade-up flex-col items-start gap-7">
            <div className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-ink-soft shadow-soft ring-1 ring-ink-border">
              <Sparkles size={15} className="text-brand" /> Award-winning services
            </div>

            <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              We specialize in <br className="hidden sm:block" />
              <span className="text-brand">{typedText}</span>
              <span className="animate-pulse text-brand">|</span>
            </h1>

            <p className="max-w-lg text-ink-muted">
              We specialize in scanning &amp; digitization, offer a wide range of products from furniture to
              clothing, and are expanding with a dynamic IT department to shape the future of technology.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="btn-primary">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>

            <div className="mt-2 flex w-full flex-col gap-4 border-t border-ink-border pt-6 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <ScanLine size={20} />
                </span>
                <span className="font-semibold text-ink">End-to-End Digitization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                  <Monitor size={20} />
                </span>
                <span className="font-semibold text-ink">Future-Ready IT Solutions</span>
              </div>
            </div>
          </div>

          {/* Visual column — static image composition, no GIF */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <img src="/assets/homepage/office.jpg" alt="Venus Global team at work" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            </div>

            {/* Accent secondary image */}
            <div className="absolute -bottom-8 -left-6 hidden h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:block lg:h-36 lg:w-36">
              <img src="/assets/homepage/cool-img.jpg" alt="Venus Global" className="h-full w-full object-cover" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute -top-5 right-2 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur sm:right-6">
              <span className="font-title text-2xl text-brand">6M+</span>
              <span className="max-w-[90px] text-xs font-medium leading-tight text-ink-soft">Documents Digitized</span>
            </div>
            <div className="absolute -right-2 bottom-10 rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl sm:-right-6">
              Growing IT Team
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Trusted partners marquee ───────────────── */}
      <section className="border-y border-ink-border bg-white py-10">
        <div className="container-x flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <div className="shrink-0 text-lg font-semibold text-ink-soft sm:text-xl">Trusted Partners</div>
          <div className="relative w-full flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-14">
              {[...clientLogos, ...clientLogos].map((n, i) => (
                <img
                  key={i}
                  src={`/assets/homepage/client/client${n}.png`}
                  alt=""
                  className="h-14 w-14 shrink-0 opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 lg:h-20 lg:w-20"
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* ───────────────── About / stats ───────────────── */}
      <section className="container-x py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-5">
            <img
              className="col-span-2 aspect-[16/10] w-full rounded-2xl object-cover shadow-card sm:col-span-1 sm:aspect-square"
              src="/assets/homepage/office.jpg"
              alt="Venus Global office"
            />
            <div className="col-span-2 grid grid-cols-2 gap-4 sm:col-span-1 sm:grid-cols-1">
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-ink px-4 py-8 text-center text-white">
                <span className="font-title text-3xl">5+ Years</span>
                <span className="text-sm text-white/70">of Trusted Services</span>
              </div>
              <div className="flex items-center justify-center rounded-2xl bg-brand px-4 py-8 text-center text-lg font-semibold text-white">
                Multiple Govt. Clients
              </div>
            </div>
            <img
              className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover shadow-card"
              src="/assets/homepage/cool-img.jpg"
              alt="Venus Global team"
            />
          </div>

          <div className="flex flex-col justify-center gap-7">
            <span className="section-tag w-fit">Empowering Businesses with Technology</span>
            <h2 className="font-title text-3xl leading-snug sm:text-4xl">
              Delivering seamless scanning, secure digitalization &amp; modern software solutions.
            </h2>
            <p className="text-ink-muted">
              We specialize in document scanning &amp; digitalization for government and enterprises, while also
              offering a diverse range of products including electronics, furniture, clothing, and stationery. Our
              new software development division is dedicated to building custom, future-ready applications that
              help organizations grow and innovate.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {trustChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                    <Check size={14} />
                  </span>
                  <span className="text-sm text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-dark w-fit">
              About More <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────── Services (dark section) ───────────────── */}
      <section className="w-full bg-ink py-20 text-white sm:py-24">
        <div className="container-x flex flex-col items-center text-center">
          <span className="section-tag bg-white/10 text-brand-200">Smart Solutions, Trusted Results</span>
          <h2 className="mt-6 max-w-3xl font-title text-3xl sm:text-5xl">
            We specialize in the following services
          </h2>

          <div className="mt-16 grid w-full grid-cols-1 gap-x-6 gap-y-14 text-left sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="group relative flex flex-col rounded-2xl bg-ink-soft pb-8 pt-12 transition hover:-translate-y-1 hover:bg-ink-soft/80">
                <div className="absolute -top-7 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                  <s.icon className="text-brand" size={24} />
                </div>
                <div className="mt-4 flex flex-1 flex-col px-6">
                  <h3 className="text-xl transition-colors duration-150 group-hover:text-brand">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm text-white/65">{s.desc}</p>
                  <Link
                    to="/services"
                    className="mt-5 flex items-center gap-2 text-sm font-medium text-brand transition-all duration-150 ease-in-out hover:gap-3"
                  >
                    Know more <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}