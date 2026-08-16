import { useState } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import SEO from '../components/common/SEO';

const CONTACT_EMAIL = 'venusglobal2020@gmail.com';
const CONTACT_PHONE_DISPLAY = '+91 9999937626';
const WHATSAPP_NUMBER = '919999937626'; // company WhatsApp number, country code + number, no + or spaces
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3501.272051528886!2d77.44137767550151!3d28.65157177565436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDM5JzA1LjciTiA3N8KwMjYnMzguMiJF!5e0!3m2!1sen!2sin!4v1757328663331!5m2!1sen!2sin';

const infoCards = [
  {
    icon: MapPin,
    title: 'Office Address',
    body: (
      <>
        <div className="flex items-center gap-2">
          <img src="/assets/contact-us-page/indiaflag.svg" alt="India" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-medium">India Office:</span>
        </div>
        <p className="mt-2 text-ink-muted">Rakesh Marg, Gandhi Nagar, Ghaziabad, Uttar Pradesh - 201002</p>
      </>
    ),
  },
  {
    icon: Mail,
    title: 'Email us',
    body: (
      <>
        <p className="text-ink-muted">We&apos;re on top of things and aim to respond to all inquiries within 24 hours.</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block font-medium text-brand hover:underline">
          {CONTACT_EMAIL}
        </a>
      </>
    ),
  },
  {
    icon: Phone,
    title: 'Call us',
    body: (
      <>
        <p className="text-ink-muted">Let&apos;s work together towards a common goal - get in touch!</p>
        <a href={`tel:${CONTACT_PHONE_DISPLAY.replace(/\s/g, '')}`} className="mt-2 block font-medium text-brand underline">
          {CONTACT_PHONE_DISPLAY}
        </a>
      </>
    ),
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Build a clean, readable WhatsApp message
    const lines = [
      '*New Enquiry — Venus Global Website*',
      '',
      `*Name:* ${form.name}`,
      `*Email:* ${form.email}`,
      form.phone ? `*Phone:* ${form.phone}` : null,
      '',
      `*Message:*`,
      form.message,
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Venus Global Enterprises — reach us via WhatsApp, email, phone, or visit our office in Ghaziabad, Uttar Pradesh."
        url="/contact"
      />

      {/* Hero image + overlapping form */}
      <section className="container-x relative">
        <div className="flex w-full flex-col items-center">
          <img
            src="/assets/contact-us-page/contact-us-bg-1.jpg"
            alt="Venus Global office"
            className="max-h-[450px] min-h-[260px] w-full max-w-[900px] rounded-lg object-cover sm:min-h-[400px] lg:w-[80%]"
          />

          <form
            onSubmit={handleSubmit}
            className="relative -mt-24 flex w-[92%] flex-col gap-6 rounded-lg bg-white px-5 pb-8 pt-10 shadow-lg sm:-mt-32 sm:px-10 md:w-fit lg:w-[70%] xl:w-[60%]"
          >
            <div className="flex items-center gap-2 text-sm text-brand">
              <FaWhatsapp size={16} /> Message us on WhatsApp
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl sm:text-4xl">Let&rsquo;s connect and collaborate</h1>
              <p className="text-base md:text-lg">
                Fill the form and it&rsquo;ll open directly in WhatsApp, sent straight to{' '}
                <span className="text-brand">{CONTACT_PHONE_DISPLAY}</span>
              </p>
            </div>
            <div className="flex flex-col gap-4 border-t border-ink-border pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Name"
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <input
                placeholder="Phone"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                required
                rows={4}
                placeholder="Message"
                className="input-field resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button type="submit" className="btn-primary w-fit !bg-[#25D366] hover:!bg-[#1da851]">
                <FaWhatsapp size={18} /> Send via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Info cards */}
      <section className="container-x mt-14 flex flex-col gap-8 py-8 sm:mt-20 lg:flex-row lg:justify-between lg:gap-0">
        {infoCards.map((c) => (
          <div key={c.title} className="w-full rounded-lg border border-ink-border bg-ink-surface shadow-md transition hover:shadow-2xl lg:w-[32%]">
            <div className="flex w-full flex-col gap-4 px-6 py-8 lg:w-[85%]">
              <c.icon className="text-brand" size={32} />
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <div>{c.body}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Map */}
      <section className="mt-10 w-full">
        <iframe
          title="Venus Global office location"
          src={MAP_EMBED_URL}
          className="h-[350px] w-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>
    </>
  );
}