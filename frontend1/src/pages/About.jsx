import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, PlayCircle, X, Lightbulb, ShieldCheck, Accessibility, Users2 } from 'lucide-react';
import SEO from '../components/common/SEO';

const heroChecklist = [
  'End-to-End Scanning & Digitization',
  'Future-Ready IT Solutions',
  'Wide Range of Products',
  'Secure & Efficient Processes',
  'Team of Professionals',
  'Dedicated Team of Professionals',
];

const stats = [
  { target: 6000000, suffix: '+', label: 'Document Digitized' },
  { target: 30, suffix: '+', label: 'Districts' },
  { target: 3, suffix: '+', label: 'States' },
  { target: 10, suffix: '+', label: 'Project Completed' },
];

const efficiencyChecklist = [
  'Proven Expertise in Digitization',
  'Reliable & Scalable IT Solutions',
  'Future-Ready Technology Adoption',
  'Affordable Pricing & Transparent Process',
  'Strong After-Sales Support',
  'Wide Variety of Products Under One Roof',
];

const featureCards = [
  { icon: Lightbulb, title: 'Innovation-Driven', desc: 'Elevate your digital presence with our innovation-driven approach' },
  { icon: ShieldCheck, title: 'Transparent approach', desc: "At our digital agency, transparency isn't just a buzzword." },
  { icon: Accessibility, title: 'Accessible technology', desc: 'Celebrate Inclusivity with Accessible Technology' },
  { icon: Users2, title: 'Collaborative teamwork', desc: 'We believe that the best results are born from the synergy of diverse teams.' },
];

function useCountUp(target, start) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, start]);

  return value;
}

function StatCounter({ target, suffix, label }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const value = useCountUp(target, inView);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="card flex flex-col items-center justify-center gap-1 p-6">
      <div>
        <span className="text-3xl text-ink">{value.toLocaleString()}</span>
        <span className="text-3xl text-brand">{suffix}</span>
      </div>
      <span className="text-ink-muted">{label}</span>
    </div>
  );
}

export default function About() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <SEO
        title="About Us"
        description="A multi-vertical company dedicated to digitization, products & technology. From scanning & digitization services to retail products and our growing IT solutions department."
        url="/about"
      />

      {/* Hero */}
      <section className="w-full bg-ink pt-10">
        <div className="container-x flex flex-col gap-6 pb-8 lg:flex-row lg:justify-between lg:gap-16 lg:pb-0">
          <div className="flex w-full flex-col gap-5 pb-8 text-white sm:items-start lg:w-[60%] lg:gap-10">
            <h1 className="text-4xl xl:text-6xl">
              A Multi-Vertical Company Dedicated to Digitization, Products &amp; Technology
            </h1>
            <p className="lg:text-lg xl:text-xl">
              From scanning &amp; digitization services to retail products and our growing IT solutions
              department, we are committed to delivering innovation, quality, and trust under one brand.
            </p>
          </div>

          <div className="flex text-white">
            <ul className="flex flex-col gap-3 lg:text-lg">
              {heroChecklist.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0 text-brand" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mission + video */}
      <section className="relative mb-8 w-full">
        <div className="absolute right-0 top-0 h-[80px] max-h-[120px] min-h-[80px] w-full bg-ink" />
        <div className="container-x flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="relative flex max-h-[400px] w-full flex-col overflow-hidden rounded-lg bg-brand px-5 pb-8 text-white lg:w-[35%]">
            <hr className="my-4 mt-8 w-[40%] border-2 border-white opacity-90 md:w-[50%]" />
            <span className="px-1 pt-4 text-xl">
              We believe innovation, quality, and trust <br /> are the keys to lasting impact.
            </span>
          </div>

          <div className="mt-16 w-full rounded shadow-2xl lg:w-[60%] lg:max-w-[700px]">
            <button
              onClick={() => setVideoOpen(true)}
              className="relative mx-auto block w-full cursor-pointer"
              aria-label="Play video"
            >
              <img src="/assets/aboutpage/thumbnail.gif" alt="Venus Global video" className="h-auto w-full rounded-lg shadow-lg" />
              <span className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="text-white drop-shadow-lg transition-transform hover:scale-110" size={64} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-x mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </section>

      {/* Efficiency section */}
      <section className="container-x mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <img
          src="/assets/aboutpage/office_work.jpeg"
          alt="Venus Global team at work"
          className="h-full max-h-[600px] w-full rounded object-cover xl:max-h-[650px]"
        />
        <div className="flex w-full flex-col items-center justify-between">
          <h2 className="w-11/12 text-4xl font-bold xl:text-6xl">Boost your business efficiency with Venus Global</h2>
          <div className="mt-10 flex w-11/12 flex-col gap-6">
            <p className="font-medium">
              Elevate your operations with our digitization services, explore our wide product range, and harness
              the power of our IT solutions.
            </p>
            <hr className="border-ink-border" />
            <p className="font-medium">
              At the heart of our company is a commitment to provide a robust, versatile, and future-ready
              platform that caters to businesses and individuals alike.
            </p>
          </div>
          <ul className="mt-10 flex w-[90%] flex-col items-start gap-3 text-lg font-bold">
            {efficiencyChecklist.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="shrink-0 text-brand" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature cards */}
      <section className="container-x my-24 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {featureCards.map((f) => (
          <div key={f.title} className="card flex flex-col items-start gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <f.icon size={22} />
            </span>
            <span className="text-xl font-bold text-ink">{f.title}</span>
            <span className="text-sm text-ink-muted">{f.desc}</span>
          </div>
        ))}
      </section>

      {/* Video modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setVideoOpen(false)}
        >
          <div className="relative w-11/12 md:w-3/4 lg:w-2/3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-12 right-0 text-white transition hover:text-brand"
              aria-label="Close video"
            >
              <X size={32} />
            </button>
            <video controls autoPlay poster="/assets/aboutpage/thumbnail.gif" className="h-auto w-full rounded-lg shadow-lg">
              <source src="/assets/aboutpage/AB.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
}