import { Link } from "react-router-dom";
import { ArrowUpRight, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import WaterWaves from "./WaterWaves";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "#" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "HIPAA Compliance", to: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", to: "#" },
      { label: "Community", to: "#" },
      { label: "Status", to: "#" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="footer-glass-wrapper relative pt-20 pb-0">
      {/* Ambient glow */}
      <div className="footer-ambient-glow" />

      {/* Water waves at bottom */}
      <WaterWaves />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24">

        {/* Main grid: big CTA left + 4 link columns right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">

          {/* Left: massive typography block */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center font-heading italic text-foreground text-xl">
                  C
                </div>
                <span className="font-heading italic text-foreground text-xl">CareDose AI</span>
              </div>
              <h2 className="font-heading italic text-foreground text-4xl md:text-5xl lg:text-6xl leading-[0.9] tracking-tight mb-6">
                Ready to never<br />miss a dose?
              </h2>
              <p className="text-foreground/40 font-body font-light text-sm leading-relaxed max-w-sm mb-8">
                AI-powered medication reminders for elderly loved ones. No smartphone needed — just a phone call away.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-6 py-3 text-sm font-medium font-body hover:bg-foreground/90 transition-colors"
              >
                Get Started Free
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-12">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: 4-column link grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {columns.map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="text-foreground/60 font-body font-medium text-xs uppercase tracking-widest mb-5">
                  {heading}
                </h4>
                <ul className="space-y-3">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-foreground/40 font-body text-sm hover:text-foreground/80 transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-foreground/[0.06] py-6 flex flex-col md:flex-row items-center justify-between gap-3 mb-[120px]">
          <span className="text-foreground/20 text-xs font-body">© 2026 CareDose AI. All rights reserved.</span>
          <span className="text-foreground/15 text-xs font-body">Made with care for families everywhere.</span>
        </div>

      </div>
    </footer>
  );
}

