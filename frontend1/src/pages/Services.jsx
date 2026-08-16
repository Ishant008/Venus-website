import { Link } from 'react-router-dom';
import {
  ScanLine,
  Monitor,
  ShoppingCart,
  Cloud,
  ShieldCheck,
  Headset,
  Users,
  Share2,
  BarChart3,
} from 'lucide-react';
import SEO from '../components/common/SEO';

const coreServices = [
  {
    icon: ScanLine,
    title: 'Scanning & Digitalization',
    desc: 'Efficiently convert physical files into secure, searchable digital formats. OCR, indexing, and archival designed for enterprises and government agencies.',
  },
  {
    icon: Monitor,
    title: 'IT Solutions',
    desc: 'Websites, mobile apps, enterprise software, and cloud systems — built with cutting-edge technology to help your business scale with confidence.',
  },
  {
    icon: ShoppingCart,
    title: 'Products',
    desc: 'Furniture, electronics, clothing, stationery, and more — trusted by corporates and institutions for quality and reliability.',
  },
];

const extendedSolutions = [
  { icon: Cloud, title: 'Cloud Hosting', desc: 'Scalable, secure cloud infrastructure tailored to your needs.' },
  { icon: ShieldCheck, title: 'Data Security', desc: 'Protecting sensitive data with compliance-driven solutions.' },
  { icon: Headset, title: '24/7 Support', desc: 'Round-the-clock technical and customer service support.' },
  { icon: Users, title: 'Consulting', desc: 'Expert advice to align digital strategies with business goals.' },
  { icon: Share2, title: 'Integration', desc: 'Seamlessly integrating systems for smooth workflows.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Turning raw data into insights that fuel decisions.' },
];

const process = [
  { step: '1', title: 'Discover', desc: 'Understanding your needs & goals.' },
  { step: '2', title: 'Plan', desc: 'Creating tailored strategies & roadmaps.' },
  { step: '3', title: 'Execute', desc: 'Delivering solutions with precision.' },
  { step: '4', title: 'Support', desc: 'Providing ongoing support & improvements.' },
];

const industries = ['Government', 'Corporate', 'Education', 'Healthcare', 'Retail'];

const stats = [
  { value: '5+', label: 'Years of Experience' },
  { value: '1.2K+', label: 'Happy Clients' },
  { value: '10+', label: 'Projects Delivered' },
  { value: '24/7', label: 'Customer Support' },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="At Venus Global, we empower organizations with digital-first solutions — scanning & digitization, IT services, and product supply."
        url="/services"
      />

      <section className="w-full bg-ink py-20 text-white">
        <div className="container-x">
          {/* Hero */}
          <div className="mb-20 text-center">
            <h1 className="text-5xl font-extrabold">
              Our <span className="text-brand">Services</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/85">
              At <span className="font-semibold uppercase text-brand">Venus global</span>, we empower
              organizations with digital-first solutions. From scanning and digitization to IT services and
              product supply, our expertise helps businesses and institutions thrive in the modern era.
            </p>
          </div>

          {/* Core services */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {coreServices.map((s) => (
              <div
                key={s.title}
                className="rounded-lg border border-brand/40 bg-ink-soft p-10 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <s.icon className="mx-auto text-brand" size={56} />
                <h3 className="mt-6 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/85">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Extended solutions */}
          <div className="mt-24">
            <h2 className="text-center text-3xl font-bold">Extended Solutions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-white/85">
              Beyond core services, we deliver a range of additional solutions to keep your organization
              future-ready.
            </p>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {extendedSolutions.map((s) => (
                <div key={s.title} className="rounded-xl bg-ink-soft p-8 shadow-white transition hover:shadow-sm">
                  <s.icon className="text-brand" size={36} />
                  <h4 className="mt-4 text-lg font-semibold">{s.title}</h4>
                  <p className="mt-2 text-sm text-white/80">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How we work */}
          <div className="mt-24">
            <h2 className="text-center text-3xl font-bold">How We Work</h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
              {process.map((p) => (
                <div key={p.step} className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-xl font-bold text-brand">
                    {p.step}
                  </div>
                  <h4 className="mt-4 font-semibold">{p.title}</h4>
                  <p className="mt-2 text-sm text-white/80">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="mt-24">
            <h2 className="text-center text-3xl font-bold">Industries We Serve</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full border border-white/20 bg-ink-soft px-6 py-3 text-white transition hover:bg-brand hover:text-white"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid gap-10 text-center sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <h4 className="text-4xl font-bold text-brand">{s.value}</h4>
                <p className="mt-2 text-white/80">{s.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-24 rounded-2xl bg-ink-soft px-3 py-16 text-center shadow-lg">
            <h3 className="text-3xl font-bold">Ready to Work With Us?</h3>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Let&rsquo;s create a solution that transforms your business. Reach out today and let&rsquo;s get
              started.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link to="/contact" className="rounded-lg bg-white px-6 py-3 font-medium text-ink transition hover:bg-brand hover:text-white">
                Contact Us
              </Link>
              <Link
                to="/contact"
                className="rounded-lg border border-white px-6 py-3 font-medium text-white transition hover:bg-white hover:text-ink-soft"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}