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

      {/* Hero */}
      <section className="container-x flex flex-col items-center gap-10 py-10 lg:flex-row lg:justify-center">
        <div className="flex w-full flex-col gap-8 pb-8 pt-6 sm:items-start lg:w-[55%]">
          <div className="w-fit rounded bg-ink-surface px-6 py-2 text-sm shadow-lg">🤩 Award-winning services</div>
          <h1 className="text-5xl leading-tight sm:text-6xl lg:text-6xl">
            We specialize in <br />
            <span className="text-brand">{typedText}</span>
            <span className="animate-pulse text-brand">|</span>
          </h1>
          <p className="text-ink-muted">
            We specialize in scanning &amp; digitization, offer a wide range of products from furniture to
            clothing, and are expanding with a dynamic IT department to shape the future of technology.
          </p>
          <div className="flex w-full flex-col gap-6 sm:w-[90%] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-2 rounded py-2 shadow-lg sm:justify-start sm:py-0 sm:shadow-none">
              <ScanLine className="text-brand" size={22} />
              <span className="font-semibold">End-to-End Digitization</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded py-2 shadow-lg sm:justify-start sm:py-0 sm:shadow-none">
              <Monitor className="text-brand" size={22} />
              <span className="font-semibold">Future-Ready IT Solutions</span>
            </div>
          </div>
        </div>

        <div className="lg:w-[40%] lg:max-h-full h-[600px] w-[90%]  rounded-lg relative bg-cover bg-center  bg-no-repeat  bg-[url(./assets/homepage/HERO.gif)]">
          {/* <img src="/assets/homepage/HERO.gif" alt="Venus Global" className="h-full w-full rounded-lg object-cover" /> */}
          <div className="absolute -top-6 -right-4 rounded-lg bg-white p-4 shadow-md md:-right-10">
            <span className="font-semibold text-brand">6M+</span> Documents Digitized
          </div>
          <div className="absolute -left-4 bottom-10 rounded-lg bg-ink p-4 text-white shadow-xl md:-left-10">
            Growing IT Team
          </div>
        </div>
      </section>

      {/* Trusted partners marquee */}
      <section className="container-x my-14 overflow-hidden">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-0">
          <div className="shrink-0 text-2xl font-bold sm:mr-8">Trusted Partners</div>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-10">
              {[...clientLogos, ...clientLogos].map((n, i) => (
                <img
                  key={i}
                  src={`/assets/homepage/client/client${n}.png`}
                  alt=""
                  className="h-20 w-20 shrink-0 transition-transform duration-300 hover:scale-105 lg:h-28 lg:w-28"
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* About / stats */}
      <section className="container-x my-10 flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between lg:w-[53%]">
          <div className="w-full sm:w-[48%]">
            <img className="w-full rounded-md object-cover" src="/assets/homepage/office.jpg" alt="Venus Global office" />
          </div>
          <div className="flex w-full flex-col gap-10 sm:w-[48%]">
            <div className="flex w-full justify-center gap-4">
              <div className="flex w-1/2 flex-col items-center justify-center rounded-md bg-ink px-2 py-5 text-white">
                <span className="text-2xl font-bold">5+ Years</span>
                <span className="w-full text-center text-sm">of Trusted Services</span>
              </div>
              <div className="flex w-1/2 items-center justify-center rounded-md bg-brand px-2 py-5 text-center text-xl font-bold text-white">
                Multiple Govt. Clients
              </div>
            </div>
            <img className="w-full rounded-md object-cover" src="/assets/homepage/cool-img.jpg" alt="Venus Global team" />
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-8 lg:w-[42%]">
          <div className="w-fit rounded-lg bg-ink-surface px-4 py-2 shadow-md">Empowering Businesses with Technology</div>
          <h2 className="text-3xl sm:text-5xl">
            Delivering seamless scanning, secure digitalization &amp; modern software solutions.
          </h2>
          <p className="text-ink-muted">
            We specialize in document scanning &amp; digitalization for government and enterprises, while also
            offering a diverse range of products including electronics, furniture, clothing, and stationery. Our
            new software development division is dedicated to building custom, future-ready applications that
            help organizations grow and innovate.
          </p>
          <ul className="flex flex-col gap-4">
            {trustChecklist.map((item) => (
              <li key={item} className="flex items-center gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                  <Check size={14} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link to="/about" className="btn-dark w-fit">
            About More <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Services (dark section) */}
      <section className="w-full bg-ink py-16 text-white">
        <div className="container-x flex flex-col items-center">
          <span className="my-6 rounded bg-ink-soft px-4 py-2 text-center">Smart Solutions, Trusted Results</span>
          <h2 className="my-6 w-full text-center text-4xl sm:w-[80%] sm:text-5xl lg:w-[60%] lg:text-6xl">
            We specialize in the following services
          </h2>

          <div className="my-10 grid w-full grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="group relative flex flex-col items-center rounded-md bg-ink-soft pb-8 pt-10">
                <div className="absolute -top-8 left-6 flex items-center justify-center rounded-full bg-white p-4">
                  <s.icon className="text-brand" size={26} />
                </div>
                <div className="mt-6 w-[85%]">
                  <div className="my-6 flex flex-col gap-3">
                    <h3 className="text-2xl transition-colors duration-150 group-hover:text-brand">{s.title}</h3>
                    <p className="text-sm text-white/70">{s.desc}</p>
                  </div>
                  <Link
                    to="/services"
                    className="flex items-center gap-2 text-brand transition-all duration-150 ease-in-out hover:gap-3"
                  >
                    Know more <ArrowRight size={18} />
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