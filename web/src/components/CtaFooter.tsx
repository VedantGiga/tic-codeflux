import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import HlsVideo from "./HlsVideo";
import WaterWaves from "./WaterWaves";

const footerColumns = {
  Solutions: [
    { label: "AI Reminders", to: "/features" },
    { label: "Smart Scheduling", to: "/features" },
    { label: "Family Dashboard", to: "/features" },
    { label: "Voice Alerts", to: "/features" },
  ],
  Resources: [
    { label: "Documentation", to: "#" },
    { label: "API Reference", to: "#" },
    { label: "Case Studies", to: "#" },
    { label: "Blog", to: "#" },
  ],
  Company: [
    { label: "About", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Press", to: "#" },
    { label: "Contact", to: "/contact" },
  ],
  Community: [
    { label: "Discord", to: "#" },
    { label: "GitHub", to: "#" },
    { label: "LinkedIn", to: "#" },
    { label: "X (Twitter)", to: "#" },
  ],
};

const CtaFooter = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });
  const footerInView = useInView(footerRef, { once: true, amount: 0.1 });
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* ── Grand CTA Section ─────────────────────────── */}
      {isHome && (
        <section className="relative py-32 md:py-40 px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="hidden dark:block">
            <HlsVideo
              src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="video-fade-top" />
            <div className="video-fade-bottom" />
          </div>

          <div ref={ctaRef} className="relative z-10 flex flex-col items-center text-center">
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-foreground tracking-tight leading-[0.9] max-w-3xl"
              initial={{ opacity: 0, y: 40 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Care starts with a single step.
            </motion.h2>
            <motion.p
              className="mt-6 text-foreground/60 font-body font-light text-sm md:text-base max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Try CareDose AI free for 30 days. No credit card required.
            </motion.p>
            <motion.div
              className="flex items-center gap-4 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/contact"
                className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium font-body text-foreground hover:bg-foreground/5 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                to="/pricing"
                className="bg-foreground text-background rounded-full px-6 py-3 text-sm font-medium font-body hover:bg-foreground/90 transition-colors"
              >
                View Plans
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Concise Liquid Glass Footer ──────── */}
      <footer className="w-full footer-glass-wrapper text-foreground py-12 md:py-20 relative font-body overflow-hidden">
        {/* Animated Liquid Waves at the boundary */}
        <WaterWaves />
        {/* Ambient glow */}
        <div className="footer-ambient-glow" />

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8">
            
            {/* Brand & Newsletter Column */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center font-heading italic text-background text-sm">
                  C
                </div>
                <span className="font-heading italic text-lg tracking-tight">CareDose AI®</span>
              </div>
              
              <div>
                <h3 className="text-2xl font-heading leading-tight mb-4 tracking-tight">
                  Stay updated with our<br/>latest clinical insights.
                </h3>
                <div className="border-b border-foreground/20 pb-2 flex justify-between items-center group cursor-pointer w-full max-w-xs transition-colors hover:border-foreground/40">
                  <span className="text-sm opacity-60">Email address</span>
                  <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Platform</h4>
              <nav className="flex flex-col gap-2.5 text-sm font-medium">
                <Link to="/" className="opacity-60 hover:opacity-100 transition-opacity">Overview</Link>
                <Link to="/features" className="opacity-60 hover:opacity-100 transition-opacity">Features</Link>
                <Link to="/pricing" className="opacity-60 hover:opacity-100 transition-opacity">Pricing</Link>
                <Link to="/contact" className="opacity-60 hover:opacity-100 transition-opacity">Information</Link>
              </nav>
            </div>

            {/* Support & Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Support</h4>
              <nav className="flex flex-col gap-2.5 text-sm font-medium">
                <a className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Help Center</a>
                <a className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">API Docs</a>
                <a className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Privacy Policy</a>
                <a className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">Terms of Use</a>
              </nav>
            </div>

            {/* Social & Contact */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Connect</h4>
              <div className="flex flex-col gap-2.5 text-sm font-medium">
                <a href="mailto:contact@curedose.com" className="opacity-60 hover:opacity-100 transition-opacity">contact@curedose.com</a>
                <div className="flex gap-4 mt-2">
                  <a className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-all cursor-pointer">
                    <ArrowUpRight className="w-3.5 h-3.5 rotate-45" />
                  </a>
                  <a className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-all cursor-pointer">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-8 border-t border-foreground/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest opacity-30">
            <p>©2026 CareDose AI. All rights reserved.</p>
            <p>Made with care for families everywhere.</p>
          </div>
        </div>

        {/* Scaled Down Branding Background */}
        <div className="absolute bottom-[-2%] left-0 right-0 overflow-hidden flex justify-center z-0 pointer-events-none select-none opacity-[0.03]">
          <h1 className="text-[15vw] leading-[0.7] font-heading tracking-[-0.05em] text-foreground whitespace-nowrap">
            CareDose
          </h1>
        </div>

        {/* Circular Animation Badge - More Integrated */}
        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center z-20 cursor-pointer group">
          <div className="absolute w-full h-full rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite] hover:pause-animation">
            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground opacity-20 group-hover:opacity-40 transition-opacity">
              <path id="badgePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
              <text fontSize="12" fontWeight="600" letterSpacing="4.2" fill="currentColor">
                <textPath href="#badgePath" startOffset="0%">
                  CAREDOSE AI ® EST 2026 
                </textPath>
              </text>
            </svg>
          </div>
          <div className="w-3 h-3 md:w-4 md:h-4 bg-foreground/10 rounded-full group-hover:bg-foreground/20 transition-all duration-500"></div>
        </div>
      </footer>
    </>
  );
};

export default CtaFooter;

