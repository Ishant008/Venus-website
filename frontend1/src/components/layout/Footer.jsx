import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { MapPin, Phone, Mail } from "lucide-react";

const social = [
  {
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/venus-360-global/",
    label: "LinkedIn",
    hover: "hover:text-blue-500",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/venusglobal360/",
    label: "Instagram",
    hover: "hover:text-pink-500",
  },
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/people/VenusGlobal-Digitization/100093651310419/",
    label: "Facebook",
    hover: "hover:text-blue-400",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@VENUSGLOBALENTERPRISES?si=IT0iOAH221g12X3F",
    label: "YouTube",
    hover: "hover:text-red-500",
  },
];

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/career", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
];

const servicesList = [
  "Scanning & Digitalization",
  "Data Management",
  "Product Supply",
  "IT Solutions",
  "Software Development",
  "Support & Maintenance",
];

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center bg-black text-white">
      <div className="container-x my-8 flex flex-col gap-10 sm:my-16 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-8">
          <h5 className="text-2xl uppercase">Venus global enterprises</h5>
          <p className="text-ink-faint">
            Your trusted partner in Scanning, Digitalization &amp; IT Solutions.
          </p>
          <div className="flex flex-col gap-6 uppercase">
            <h6>Follow Us</h6>
            <div className="flex gap-8">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`text-lg transition-all duration-300 ease-in-out hover:scale-125 ${s.hover}`}
                >
                  <s.icon />
                </a>
              ))}
            </div>
            <Link
              to="/admin/login"
              className="btn-outline !px-5 !py-2.5 text-sm"
            >
              Admin
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-10 sm:flex-nowrap">
          <div className="flex flex-col gap-8 uppercase">
            <h6 className="text-sm font-bold sm:text-lg">Quick Links</h6>
            <ul className="flex flex-col gap-3 text-sm text-ink-faint sm:text-lg">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="cursor-pointer transition-colors duration-150 ease-in hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 uppercase">
            <h6 className="text-sm font-bold sm:text-lg">Services</h6>
            <ul className="flex flex-col gap-3 text-sm text-ink-faint sm:text-lg">
              {servicesList.map((s) => (
                <li
                  key={s}
                  className="cursor-pointer transition-colors duration-150 ease-in hover:text-brand"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 uppercase">
            <h6 className="text-sm font-bold sm:text-lg">Contact Us</h6>
            <ul className="flex flex-col gap-3 text-sm normal-case text-ink-faint sm:text-lg">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-brand" /> Ghaziabad,
                Uttar Pradesh
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-brand" />
                <a
                  href="tel:+919999937626"
                  className="transition-colors hover:text-brand"
                >
                  +91 9999937626
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-brand" />
                <a
                  href="mailto:venusglobal2020@gmail.com"
                  className="transition-colors hover:text-brand"
                >
                  venusglobal2020@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full bg-ink py-4 text-center text-sm sm:mt-10 sm:text-lg">
        &copy; {new Date().getFullYear()} VENUS GLOBAL. All rights reserved. |
        Trusted Partner in Digital Transformation
      </div>
    </footer>
  );
}
